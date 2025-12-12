import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { dataService } from "@/lib/dataService"; // Import the API helper

interface RemarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RemarkModal({ isOpen, onClose }: RemarkModalProps) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // Prepare data for the API
    const remarkData = {
      clientName: formData.get("clientName") as string,
      companyName: formData.get("companyName") as string,
      rating: rating,
      comment: formData.get("comment") as string,
    };

    try {
      // Send to Backend
      await dataService.addRemark(remarkData);

      toast({
        title: "Thank you for your feedback!",
        description: "Your testimonial has been submitted for review.",
      });

      // Reset and Close
      setRating(5);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit remark. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal - Fixed Positioning */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }}
            transition={{ duration: 0.2 }}
            // CSS FIX: Removed 'bottom-1' and ensured standard centering
            className="fixed left-1/2 top-1/2 w-full max-w-lg z-50 px-4"
          >
            <div className="glass-card p-6 border border-border/50 shadow-2xl bg-card/90">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Leave a Remark</h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="clientName">Your Name *</Label>
                  <Input
                    id="clientName"
                    name="clientName" // Added name attribute for FormData
                    placeholder="John Doe"
                    required
                    className="bg-secondary/50 border-border/50"
                  />
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company (Optional)</Label>
                  <Input
                    id="companyName"
                    name="companyName" // Added name attribute for FormData
                    placeholder="Acme Inc."
                    className="bg-secondary/50 border-border/50"
                  />
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <Label>Rating *</Label>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i + 1)}
                        onMouseEnter={() => setHoveredRating(i + 1)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            i < (hoveredRating || rating)
                              ? "text-primary fill-primary"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-muted-foreground text-sm font-mono">
                      {rating}/5
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <Label htmlFor="comment">Your Comment *</Label>
                  <Textarea
                    id="comment"
                    name="comment" // Added name attribute for FormData
                    placeholder="Share your experience working with me..."
                    required
                    rows={4}
                    className="bg-secondary/50 border-border/50 resize-none"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="default"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Remark
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Your remark will be reviewed before being published.
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}