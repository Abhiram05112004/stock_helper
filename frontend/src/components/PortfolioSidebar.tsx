
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { PortfolioItem } from "@/components/portfolio/PortfolioItem";
import { AddStockForm } from "@/components/portfolio/AddStockForm";

interface PortfolioSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function PortfolioSidebar({ open, onClose }: PortfolioSidebarProps) {
  const { items } = usePortfolio();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[400px] sm:w-[540px]">
        <div className="h-full flex flex-col">
          <div className="px-1">
            <h2 className="text-2xl font-semibold mb-4">Your Portfolio</h2>
          </div>
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Your portfolio is empty</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add stocks to start tracking your investments
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <PortfolioItem key={item.id} item={item} />
                ))
              )}
            </div>
          </ScrollArea>
          <div className="mt-6 pb-4">
            <AddStockForm />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
