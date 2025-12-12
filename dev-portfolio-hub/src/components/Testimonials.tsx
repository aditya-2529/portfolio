import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestimonialCard } from "@/components/TestimonialCard";
import { RemarkModal } from "@/components/RemarkModal";
import { dataService, Remark } from "@/lib/dataService";

export function Testimonials() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRemarks = async () => {
      try {
        const data = await dataService.getRemarks();
        // Only show approved remarks on the public page
        const approvedRemarks = data.filter((r) => r.isApproved);
        setRemarks(approvedRemarks);
      } catch (error) {
        console.error("Failed to fetch remarks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRemarks();
  }, []);

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono text-sm mb-4 block">&lt;testimonials /&gt;</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Client <span className="gradient-text">Remarks</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Don't just take my word for it. Here's what clients say about working with me.
          </p>
          <Button
            variant="default" // Changed 'hero' to 'default' in case 'hero' variant is missing in UI components
            onClick={() => setIsModalOpen(true)}
            className="gap-2"
          >
            <MessageSquarePlus className="w-5 h-5" />
            Leave a Remark
          </Button>
        </motion.div>

        {/* Testimonials Grid */}
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading testimonials...</div>
        ) : remarks.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {remarks.map((remark, index) => (
              <TestimonialCard key={remark._id} remark={remark} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            No testimonials yet. Be the first to leave one!
          </div>
        )}
      </div>

      <RemarkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}