import { Github, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// 1. Update the interface to include 'tags'
interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  githubUrl: string;
  liveUrl?: string;
  tags?: string[]; // Added this optional prop
}

export const ProjectCard = ({
  title,
  description,
  imageUrl,
  githubUrl,
  liveUrl,
  tags = [], // Default to empty array if missing
}: ProjectCardProps) => {
  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border-primary/20 bg-card/50 backdrop-blur">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
        />
      </div>
      
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {/* 2. Map through tags and display them */}
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <CardDescription className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </CardDescription>
      </CardContent>
      
      <CardFooter className="flex gap-4 pt-4">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" />
            Code
          </a>
        </Button>
        
        {/* Only show Live Demo button if liveUrl exists */}
        {liveUrl && (
          <Button asChild size="sm" className="flex-1">
            <a href={liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Live Demo
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};