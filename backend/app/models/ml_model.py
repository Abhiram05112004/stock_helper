import numpy as np
import pandas as pd
import yfinance as yf
import torch
from transformers import BertTokenizer, BertForSequenceClassification
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping
import warnings
import requests
from app.core.config import settings

warnings.filterwarnings('ignore')

class IndianStockPredictor:
    def __init__(self, stock_symbol, exchange='NSE'):
        """
        Initialize the stock predictor
        :param stock_symbol: Stock symbol (e.g., 'INFY' for Infosys)
        :param exchange: Stock exchange ('NSE' or 'BSE')
        """
        self.stock_symbol = f"{stock_symbol}.{'NS' if exchange == 'NSE' else 'BO'}"
        self.sentiment_model = self._load_sentiment_model()
        self.price_model = None
        self.feature_names = None

    def _load_sentiment_model(self):
        """Load pre-trained BERT model for sentiment analysis"""
        try:
            # Use multilingual model
            tokenizer = BertTokenizer.from_pretrained('yiyanghkust/finbert-tone')
            model = BertForSequenceClassification.from_pretrained(
                'yiyanghkust/finbert-tone',
                num_labels=3,  # Binary sentiment classification
                output_attentions=False,
                output_hidden_states=False
            )

            return {
                'tokenizer': tokenizer,
                'model': model
            }
        except Exception as e:
            print(f"Error loading sentiment model: {e}")
            return None

    def _fetch_stock_data(self, period='1y'):
        """Fetch historical stock data"""
        try:
            stock = yf.Ticker(self.stock_symbol)
            data = stock.history(period=period)

            if data.empty:
                raise Exception(f"No data found for {self.stock_symbol}")

            if len(data) < 20:
                raise Exception(f"Insufficient data points for {self.stock_symbol}. Found {len(data)} points, need at least 20.")

            return data
        except Exception as e:
            raise Exception(f"Error fetching stock data: {str(e)}")

    def _add_technical_indicators(self, df):
        """Add technical indicators to the dataframe"""
        try:
            # Moving averages
            df['SMA_20'] = df['Close'].rolling(window=20).mean()
            df['SMA_50'] = df['Close'].rolling(window=50).mean()
            df['EMA_20'] = df['Close'].ewm(span=20, adjust=False).mean()

            # RSI
            delta = df['Close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss
            df['RSI'] = 100 - (100 / (1 + rs))

            # MACD
            exp1 = df['Close'].ewm(span=12, adjust=False).mean()
            exp2 = df['Close'].ewm(span=26, adjust=False).mean()
            df['MACD'] = exp1 - exp2
            df['Signal_Line'] = df['MACD'].ewm(span=9, adjust=False).mean()

            # Bollinger Bands
            df['BB_middle'] = df['Close'].rolling(window=20).mean()
            bb_std = df['Close'].rolling(window=20).std()
            df['BB_upper'] = df['BB_middle'] + (bb_std * 2)
            df['BB_lower'] = df['BB_middle'] - (bb_std * 2)

            # Volume indicators
            df['Volume_MA'] = df['Volume'].rolling(window=20).mean()
            df['Volume_Rate'] = df['Volume'] / df['Volume_MA']

            # Fill NaN values
            df = df.fillna(method='ffill').fillna(method='bfill').fillna(0)
            
            return df
        except Exception as e:
            raise Exception(f"Error adding technical indicators: {str(e)}")

    def _prepare_price_model(self):
        """Prepare LSTM model with technical indicators"""
        # Fetch stock data
        data = self._fetch_stock_data()
        if data is None:
            return None
        # Add technical indicators
        data = self._add_technical_indicators(data)
        
        # Drop NaN values from indicator calculations
        data = data.dropna()

        # Define and store feature names
        self.feature_names = ['Open', 'High', 'Low', 'Close', 'Volume',
                            'SMA_20', 'SMA_50', 'EMA_20', 'RSI', 'MACD',
                            'Signal_Line', 'BB_middle', 'BB_upper', 'BB_lower',
                            'Volume_Rate']

        X = data[self.feature_names].values

        # Scale the features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        # Prepare sequence data for LSTM
        X_sequence = []
        y_sequence = []
        for i in range(len(X_scaled) - 60):
            X_sequence.append(X_scaled[i:i+60])
            y_sequence.append(X_scaled[i+60][3])  # Predict Close price

        X_sequence = np.array(X_sequence)
        y_sequence = np.array(y_sequence)

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_sequence, y_sequence, test_size=0.2, random_state=42
        )

        # Build model
        model = Sequential([
            LSTM(80, return_sequences=True, input_shape=(60, len(self.feature_names))),
            Dropout(0.2),
            LSTM(80, return_sequences=False),
            Dropout(0.2),
            Dense(40, activation='relu'),
            Dense(1, activation='linear')
        ])

        model.compile(optimizer='adam', loss='mse')

        early_stopping = EarlyStopping(
            monitor='val_loss',
            patience=9,
            restore_best_weights=True
        )

        history = model.fit(
            X_train, y_train,
            epochs=80,
            batch_size=32,
            validation_split=0.2,
            callbacks=[early_stopping],
            verbose=0
        )

        # Calculate accuracies
        train_pred = model.predict(X_train)
        test_pred = model.predict(X_test)
        train_accuracy = r2_score(y_train, train_pred)
        test_accuracy = r2_score(y_test, test_pred)

        model.train_accuracy = train_accuracy
        model.test_accuracy = test_accuracy

        return model, scaler, data

    def analyze_sentiment(self, text):
        """Perform sentiment analysis using BERT"""
        if not self.sentiment_model:
            return 0.5  # Neutral sentiment if model fails

        try:
            inputs = self.sentiment_model['tokenizer'](
                text,
                return_tensors='pt',
                truncation=True,
                padding=True,
                max_length=512
            )

            with torch.no_grad():
                outputs = self.sentiment_model['model'](**inputs)
                predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
                sentiment_score = predictions[0][1].item()

            return sentiment_score
        except Exception as e:
            print(f"Sentiment analysis error: {e}")
            return 0.5

    def parse_news_content(self, news_content):
        articles = []
        # Split the news content into lines
        lines = news_content.strip().split('\n')

        # Iterate through each line
        for line in lines:
          # Check if the line starts with a bullet point or other indicator for a new article
            if line.startswith("*") or line.startswith("-") or line.startswith("•"):
                # Remove the bullet point and split into title and summary
                parts = line[1:].split(":", 1)

                # Check if title and summary are present
                if len(parts) == 2:
                    title = parts[0].strip()
                    summary = parts[1].strip()

                    # Add title and summary as a dictionary to the articles list
                    articles.append({"title": title[2:-2], "description": summary})
            elif ":" in line: # handle other formats where title and summary is separated by ':'
                parts = line.split(":", 1)
                if len(parts) == 2:
                    title = parts[0].strip()
                    summary = parts[1].strip()
                    articles.append({"title": title[2:-2], "description": summary})

        return articles

    def fetch_news(self, company, api_key, num_articles):
        url = "https://api.perplexity.ai/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "sonar",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a financial news expert. Provide accurate information about the latest news concerning the specified company. Focus on factual reporting and avoid opinions or predictions unless they are explicitly stated in the news. Structure your response as a list of news items. Format each news item as a bulleted list with the title and summary separated by a colon. Example: * Title: Summary.  Do not include any introductory or concluding statements."
                },
                {
                    "role": "user",
                    "content": f"give me the most recent and important news updates for {company}."
                }
            ],
            "max_tokens": 300,  # Adjust as needed
            "temperature": 0.2,  # Adjust for factual accuracy
            "top_p": 0.9,
            "return_images": False,
            "return_related_questions": False,
            "stream": False,
            "web_search_options": {"search_context_size": "high"}
        }

        try:
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()  # Check for HTTP request errors
            data = response.json()

            news_content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            if not news_content:
                print("No news content found in the API response.")
                return None

            news_articles = self.parse_news_content(news_content)
            # for article in news_articles:
            #     print(f"Title: {article['title']}")
            #     print(f"Summary: {article['description']}")

            return news_articles

        except requests.exceptions.RequestException as e:
            print(f"HTTP request error: {e}")
            return None
        except (KeyError, IndexError) as e:
            print(f"Error parsing API response: {e}")
            return None

    def predict_stock(self):
        """Comprehensive stock prediction"""
        try:
            # Prepare price model
            model_prep = self._prepare_price_model()
            if model_prep is None:
                raise Exception("Failed to prepare price model")

            self.price_model, scaler, data = model_prep

            # Get the latest data point with technical indicators
            latest_data = data[self.feature_names].iloc[-60:].values
            X_scaled = scaler.transform(latest_data)

            # Reshape for LSTM input
            last_sequence = X_scaled.reshape(1, 60, len(self.feature_names))

            # Predict next price
            predicted_scaled_price = self.price_model.predict(last_sequence)[0][0]

            # Create a dummy row for inverse transform
            dummy = np.zeros((1, len(self.feature_names)))
            dummy[0, 3] = predicted_scaled_price
            predicted_price = scaler.inverse_transform(dummy)[0, 3]

            # Calculate volatility and confidence
            returns = data['Close'].pct_change().dropna()
            volatility = float(np.std(returns)) if not returns.empty else 0.0
            confidence = max(min(95 - (volatility * 1000), 99.9), 50)

            # Determine action and timing
            current_price = float(data['Close'].iloc[-1])
            price_change_pct = float(((predicted_price - current_price) / current_price) * 100) if current_price != 0 else 0.0

            action = 'BUY' if price_change_pct > 0.35 else 'SELL'
            timing = 'Short-term' if abs(price_change_pct) < 2 else 'Long-term'

            # Fetch news and calculate sentiment
            stock_symbol = self.stock_symbol.split(".")[0]
            news = self.fetch_news(stock_symbol, settings.perplexity_api_key, 9)
            
            if news:
                news_sentiments = [self.analyze_sentiment(item['description']) for item in news]
                market_sentiment = 'Positive' if np.mean(news_sentiments) > 0.5 else 'Negative'
            else:
                market_sentiment = 'Neutral'

            return {
                'action': action,
                'timing_recommendation': timing,
                'predicted_return': float(price_change_pct),
                'confidence': float(confidence),
                'current_price': float(current_price),
                'predicted_price': float(predicted_price),
                'volatility': float(volatility),
                'market_sentiment': market_sentiment,
                'price_model_train_accuracy': float(self.price_model.train_accuracy),
                'price_model_test_accuracy': float(self.price_model.test_accuracy)
            }
        except Exception as e:
            raise Exception(f"Failed to generate prediction: {str(e)}")

    def display_prediction(self):
        """Display formatted stock prediction"""
        prediction = self.predict_stock()
        if prediction is None:
            #print("Unable to generate prediction.")
            return

        print(f"\nStock: {self.stock_symbol}")
        print(f"Recommended Action: {prediction['action']}")
        print(f"Timing Recommendation: {prediction['timing_recommendation']}")
        print(f"\nPredicted Return: {prediction['predicted_return']:.2f}%")
        print(f"Confidence Level: {prediction['confidence']:.2f}%")
        print(f"\nCurrent Price: ₹{prediction['current_price']:.2f}")
        print(f"Predicted Price: ₹{prediction['predicted_price']:.2f}")
        print(f"Current Volatility: {prediction['volatility']:.4f}")
        print(f"Market Sentiment: {prediction['market_sentiment']}")
        print("\nModel Performance Metrics:")
        print(f"Price Model - Train Accuracy (R²): {prediction['price_model_train_accuracy']:.4f}")
        print(f"Price Model - Test Accuracy (R²): {prediction['price_model_test_accuracy']:.4f}")

# predictor = IndianStockPredictor('INFY',"NSE")  # you can give input here
# predictor.display_prediction()