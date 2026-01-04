import { Link } from "react-router-dom";
import { ArrowLeft, Truck } from "lucide-react";
import BookingForm from "@/components/booking/BookingForm";

const Book = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="w-px h-6 sm:h-8 bg-border" />
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-accent flex items-center justify-center">
                  <Truck className="w-4 h-4 text-accent-foreground" />
                </div>
                <span className="text-base sm:text-lg font-bold text-foreground">
                  Trans<span className="text-accent">Logic</span>
                </span>
              </Link>
            </div>
            
            <div className="text-xs sm:text-sm text-muted-foreground">
              <span className="hidden sm:inline">Need help? </span>
              <a href="#" className="text-accent hover:underline">Support</a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-6 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
              Book Your Shipment
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-4">
              Enter your route details, package information, and select a truck type to get an instant quote.
            </p>
          </div>

          <BookingForm />
        </div>
      </main>
    </div>
  );
};

export default Book;
