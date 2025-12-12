export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  createdAt: Date;
}

export interface Remark {
  id: string;
  clientName: string;
  companyName?: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
}

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "A full-featured online store with cart, payments, and inventory management. Built with modern tech stack for optimal performance.",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Task Management App",
    description: "Collaborative project management tool with real-time updates, team collaboration, and advanced analytics.",
    imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Socket.io"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    title: "AI Content Generator",
    description: "Leveraging OpenAI's GPT for automated content creation, blog writing, and social media post generation.",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    tags: ["Python", "FastAPI", "OpenAI", "React"],
    githubUrl: "https://github.com",
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "4",
    title: "Real Estate Finder",
    description: "Property listing platform with advanced search, virtual tours, and mortgage calculator integration.",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    tags: ["Vue.js", "Express", "MySQL", "Mapbox"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    createdAt: new Date("2024-04-05"),
  },
  {
    id: "5",
    title: "Fitness Tracker",
    description: "Mobile-first workout tracking application with exercise library, progress charts, and social features.",
    imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80",
    tags: ["React Native", "Firebase", "Redux"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    createdAt: new Date("2024-05-12"),
  },
  {
    id: "6",
    title: "Crypto Dashboard",
    description: "Real-time cryptocurrency tracking with portfolio management, price alerts, and market analysis tools.",
    imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80",
    tags: ["React", "WebSocket", "Chart.js", "Node.js"],
    githubUrl: "https://github.com",
    createdAt: new Date("2024-06-01"),
  },
];

export const mockRemarks: Remark[] = [
  {
    id: "1",
    clientName: "Sarah Johnson",
    companyName: "TechStart Inc.",
    rating: 5,
    comment: "Exceptional work! Delivered the project ahead of schedule with amazing attention to detail. Communication was excellent throughout.",
    isApproved: true,
    createdAt: new Date("2024-03-15"),
  },
  {
    id: "2",
    clientName: "Michael Chen",
    companyName: "Digital Solutions",
    rating: 5,
    comment: "One of the best developers I've worked with. The code quality was outstanding and the final product exceeded expectations.",
    isApproved: true,
    createdAt: new Date("2024-04-20"),
  },
  {
    id: "3",
    clientName: "Emily Rodriguez",
    rating: 4,
    comment: "Great experience working together. Very professional and responsive. Would definitely recommend for any web development project.",
    isApproved: true,
    createdAt: new Date("2024-05-10"),
  },
  {
    id: "4",
    clientName: "David Kim",
    companyName: "Innovate Labs",
    rating: 5,
    comment: "Transformed our outdated platform into a modern, scalable solution. Technical expertise and creativity are top-notch!",
    isApproved: true,
    createdAt: new Date("2024-06-05"),
  },
  {
    id: "5",
    clientName: "Pending Review",
    rating: 3,
    comment: "This is a test remark that hasn't been approved yet.",
    isApproved: false,
    createdAt: new Date("2024-06-20"),
  },
];
