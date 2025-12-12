import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Code2,
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Mail, // New Icon
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Github,
  Star,
  ExternalLink,
  Calendar,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { dataService, ProjectData, ContactMessage, Remark } from "@/lib/dataService"; // Added ContactMessage

interface Project extends ProjectData {
  id?: string;
  createdAt?: Date | string;
}


// Added 'messages' to Tab type
type Tab = "projects" | "remarks" | "messages";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]); // New State
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectData, remarksData, messagesData] = await Promise.all([
        dataService.getProjects(),
        dataService.getRemarks(),
        dataService.getMessages() // Fetch messages
      ]);

      setProjects(projectData);
      setRemarks(remarksData);
      setMessages(messagesData);
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Could not connect to the backend.",
        variant: "destructive",
      });
    }
  };

  // --- HANDLERS ---

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await dataService.deleteMessage(id);
      setMessages(messages.filter(m => m._id !== id));
      toast({ title: "Message deleted" });
    } catch (error) {
      toast({ title: "Error deleting message", variant: "destructive" });
    }
  };

  const handleToggleApproval = async (remarkId: string) => {
    const remark = remarks.find(r => r._id === remarkId);
    if (!remark) return;

    try {
      await dataService.toggleRemarkApproval(remarkId, !remark.isApproved);
      setRemarks(remarks.map((r) =>
        r._id === remarkId ? { ...r, isApproved: !r.isApproved } : r
      ));
      toast({ title: "Status updated" });
    } catch (error) {
      toast({ title: "Error updating status", variant: "destructive" });
    }
  };

  const handleDeleteRemark = async (remarkId: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await dataService.deleteRemark(remarkId);
      setRemarks(remarks.filter((r) => r._id !== remarkId));
      toast({ title: "Remark deleted" });
    } catch (error) {
      toast({ title: "Error deleting remark", variant: "destructive" });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await dataService.deleteProject(projectId);
      setProjects(projects.filter((p) => (p._id || p.id) !== projectId));
      toast({ title: "Project deleted" });
    } catch (error) {
      toast({ title: "Error deleting project", variant: "destructive" });
    }
  };

  const handleSaveProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const projectPayload: ProjectData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      imageUrl: formData.get("imageUrl") as string,
      tags: (formData.get("tags") as string).split(",").map((t) => t.trim()),
      githubUrl: (formData.get("githubUrl") as string) || "",
      liveUrl: (formData.get("liveUrl") as string) || undefined,
    };

    try {
      if (editingProject) {
        const projectId = editingProject._id || editingProject.id;
        if (projectId) {
            await dataService.updateProject(projectId, projectPayload);
            toast({ title: "Project updated" });
        }
      } else {
        await dataService.saveProject(projectPayload);
        toast({ title: "Project created" });
      }
      loadData();
      setIsProjectDialogOpen(false);
      setEditingProject(null);
    } catch (error) {
      toast({ title: "Error saving project", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r border-border/50 bg-card/50 backdrop-blur-xl p-6 hidden lg:block fixed h-full"
      >
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="p-2 rounded-lg bg-primary/10">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg">
            Dev<span className="text-primary">Folio</span>
          </span>
        </Link>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "projects" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <FolderKanban className="w-5 h-5" />
            Projects
          </button>
          <button
            onClick={() => setActiveTab("remarks")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "remarks" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Remarks
            {remarks.filter((r) => !r.isApproved).length > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {remarks.filter((r) => !r.isApproved).length}
              </Badge>
            )}
          </button>
          
          {/* New Inbox Tab */}
          <button
            onClick={() => setActiveTab("messages")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "messages" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <Mail className="w-5 h-5" />
            Inbox
            {messages.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {messages.length}
              </Badge>
            )}
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </Link>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6 text-primary" />
                {activeTab === "projects" && "Project Manager"}
                {activeTab === "remarks" && "Remarks Manager"}
                {activeTab === "messages" && "Message Inbox"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {activeTab === "projects" && "Manage your portfolio projects"}
                {activeTab === "remarks" && "Review and approve client testimonials"}
                {activeTab === "messages" && "View inquiries from your contact form"}
              </p>
            </div>

            {activeTab === "projects" && (
              <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingProject(null)} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSaveProject} className="space-y-4 mt-4">
                    {/* Reuse your existing form inputs here */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input name="title" defaultValue={editingProject?.title} required className="bg-secondary/50"/>
                        </div>
                        <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input name="imageUrl" defaultValue={editingProject?.imageUrl} required className="bg-secondary/50"/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea name="description" defaultValue={editingProject?.description} required className="bg-secondary/50"/>
                    </div>
                    <div className="space-y-2">
                        <Label>Tags (comma separated)</Label>
                        <Input name="tags" defaultValue={Array.isArray(editingProject?.tags) ? editingProject?.tags.join(", ") : ""} className="bg-secondary/50"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>GitHub URL</Label>
                            <Input name="githubUrl" defaultValue={editingProject?.githubUrl} className="bg-secondary/50"/>
                        </div>
                        <div className="space-y-2">
                            <Label>Live URL</Label>
                            <Input name="liveUrl" defaultValue={editingProject?.liveUrl} className="bg-secondary/50"/>
                        </div>
                    </div>
                    <Button type="submit" className="w-full mt-4">Save Project</Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </header>

        <main className="p-6">
          {/* PROJECTS TAB */}
          {activeTab === "projects" && (
            <div className="grid gap-4">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4 flex items-center gap-4 bg-secondary/20 rounded-lg border border-border/50"
                >
                  <img src={project.imageUrl} alt={project.title} className="w-20 h-14 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{project.title}</h3>
                    <div className="flex gap-2 mt-1">
                        {Array.isArray(project.tags) && project.tags.slice(0,3).map((t,i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{t}</Badge>
                        ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingProject(project); setIsProjectDialogOpen(true); }}>
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project._id || project.id!)} className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* REMARKS TAB */}
          {activeTab === "remarks" && (
            <div className="grid gap-4">
              {remarks.map((remark, index) => (
                <motion.div
                  key={remark._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`glass-card p-4 border-l-4 rounded-r-lg bg-secondary/10 ${remark.isApproved ? "border-l-primary" : "border-l-destructive"}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold">{remark.clientName}</span>
                            <span className="text-muted-foreground text-sm">({remark.rating}/5 Stars)</span>
                        </div>
                        <p className="text-sm italic">"{remark.comment}"</p>
                        <p className="text-xs text-muted-foreground mt-2">{new Date(remark.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm">{remark.isApproved ? "Approved" : "Pending"}</span>
                        <Switch checked={remark.isApproved} onCheckedChange={() => handleToggleApproval(remark._id)} />
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteRemark(remark._id)} className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* MESSAGES TAB (New) */}
          {activeTab === "messages" && (
            <div className="grid gap-4">
              {messages.length === 0 && <div className="text-center py-10 text-muted-foreground">No messages yet.</div>}
              {messages.map((msg, index) => (
                <motion.div
                  key={msg._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-6 rounded-lg bg-secondary/10 border border-border/50 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{msg.firstName} {msg.lastName}</h3>
                            <a href={`mailto:${msg.email}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {msg.email}
                            </a>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                            <Calendar className="w-3 h-3" />
                            {new Date(msg.createdAt).toLocaleDateString()}
                        </div>
                        <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteMessage(msg._id)}
                            className="h-8"
                        >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                    </div>
                  </div>
                  
                  <div className="bg-background/50 p-4 rounded-md border border-border/30">
                    <h4 className="font-semibold text-sm mb-2 text-primary">Subject: {msg.subject}</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{msg.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;