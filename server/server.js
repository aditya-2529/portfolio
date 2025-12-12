require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Project = require('./models/Project');
const Remark = require('./models/Remark');
const Contact = require('./models/Contact');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());


// 1. CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));


app.post('/saveproject', async (req, res) => {
    const { title,description,imageUrl,tags,githubUrl,liveUrl } = req.body;

    try {
        const existingProject = await Project.findOne({ title });
        if (existingProject) return res.status(400).json({ error: "Project exists with given title" });

        const project = await Project.create({ 
            title,description,imageUrl,tags,githubUrl,liveUrl 
        });

        res.json({ 
            success: true, 
            title : project.title,
            description : project.description,
            imageUrl : project.imageUrl,
            tags : project.tags,
            githubUrl : project.githubUrl,
            liveUrl : project.liveUrl
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        if (!projects) return res.status(404).json({ error: "Project not found" });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/updateproject/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, imageUrl, tags, githubUrl, liveUrl } = req.body;

    try {
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { title, description, imageUrl, tags, githubUrl, liveUrl },
            { new: true } // Returns the updated document instead of the old one
        );

        if (!updatedProject) return res.status(404).json({ error: "Project not found" });

        res.json({ success: true, project: updatedProject });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Project
app.delete('/deleteproject/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProject = await Project.findByIdAndDelete(id);
        
        if (!deletedProject) return res.status(404).json({ error: "Project not found" });

        res.json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/remarks', async (req, res) => {
    try {
        const remarks = await Remark.find().sort({ createdAt: -1 });
        res.json(remarks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Add a New Remark (Client Side)
app.post('/addremark', async (req, res) => {
    const { clientName, companyName, rating, comment } = req.body;
    try {
        const newRemark = await Remark.create({
            clientName,
            companyName,
            rating,
            comment,
            isApproved: false // Always false initially
        });
        res.json({ success: true, remark: newRemark });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Toggle Approval Status (Admin Only)
app.put('/toggleapproval/:id', async (req, res) => {
    const { id } = req.params;
    const { isApproved } = req.body;

    try {
        const updatedRemark = await Remark.findByIdAndUpdate(
            id,
            { isApproved },
            { new: true }
        );
        res.json({ success: true, remark: updatedRemark });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Delete Remark
app.delete('/deleteremark/:id', async (req, res) => {
    try {
        await Remark.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Remark deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/contact', async (req, res) => {
    const { firstName, lastName, email, subject, message } = req.body;

    try {
        const newContact = await Contact.create({
            firstName,
            lastName,
            email,
            subject,
            message
        });
        res.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/deletecontact/:id', async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Message deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));