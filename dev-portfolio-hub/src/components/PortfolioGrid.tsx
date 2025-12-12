import { useEffect, useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { dataService, ProjectData } from "../lib/dataService";

export const PortfolioGrid = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await dataService.getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading projects...</div>;
  }

  return (
    <section className="py-20 px-4 bg-secondary/30" id="portfolio">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Featured <span className="text-primary">Projects</span>
        </h2>
        
        {projects.length === 0 ? (
          <div className="text-center text-gray-500">No projects found. Add some from the Admin Dashboard!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard 
                key={project._id || project.title} 
                {...project} 
                tags={Array.isArray(project.tags) ? project.tags : []}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};