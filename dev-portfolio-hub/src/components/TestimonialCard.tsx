import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Remark } from "@/lib/dataService";

interface TestimonialCardProps {
  remark: Remark;
  index: number;
}

export function TestimonialCard({ remark, index }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="glass-card p-6 relative group"
    >
      {/* Quote Icon */}
      <div className="absolute -top-3 -left-3 p-2 rounded-lg bg-primary/20 border border-primary/30">
        <Quote className="w-4 h-4 text-primary" />
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < remark.rating ? "text-primary fill-primary" : "text-muted-foreground"
            }`}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-foreground/90 mb-6 leading-relaxed">"{remark.comment}"</p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">
            {remark.clientName.charAt(0)}
          </span>
        </div>
        <div>
          <p className="font-semibold text-sm">{remark.clientName}</p>
          {remark.companyName && (
            <p className="text-muted-foreground text-xs">{remark.companyName}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
