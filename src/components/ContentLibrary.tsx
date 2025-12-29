import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    ArrowLeft,
    Upload,
    Eye,
    FileText,
    Plus,
    Library,
    Sparkles,
} from "lucide-react";

interface ContentItem {
    id: string;
    title: string;
    className: string;
    pdfUrl: string;
    uploadDate: string;
}

interface ContentLibraryProps {
    onBack?: () => void;
}

export function ContentLibrary({ onBack }: ContentLibraryProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const backRoute = (location.state as any)?.backRoute || "/reading-modules"
    
    const handleBack = () => {
        if (onBack) {
            onBack()
        } else {
            navigate(backRoute)
        }
    }
    const [contentItems, setContentItems] = useState<ContentItem[]>([
        {
            id: "1",
            title: "Introduction to Public Speaking",
            className: "Grade 5A",
            pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            uploadDate: "2024-10-15",
        },
        {
            id: "2",
            title: "Persuasive Speech Techniques",
            className: "Grade 6B",
            pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            uploadDate: "2024-10-20",
        },
        {
            id: "3",
            title: "Storytelling Fundamentals",
            className: "Grade 4C",
            pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            uploadDate: "2024-10-25",
        },
    ]);

    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newClassName, setNewClassName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
        }
    };

    const handleAddContent = () => {
        if (newTitle && newClassName && selectedFile) {
            const newItem: ContentItem = {
                id: Date.now().toString(),
                title: newTitle,
                className: newClassName,
                pdfUrl: URL.createObjectURL(selectedFile),
                uploadDate: new Date().toISOString().split("T")[0],
            };
            setContentItems([...contentItems, newItem]);
            setNewTitle("");
            setNewClassName("");
            setSelectedFile(null);
            setIsUploadDialogOpen(false);
        }
    };

    const TEXT_LIGHT = "#F2F6FF";
    const TEXT_MUTED = "rgba(242,246,255,0.78)";

    const BLUE_BG: React.CSSProperties = {
        backgroundColor: "#123A8A",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
    };

    return (
        <div className="min-h-screen relative overflow-x-hidden">
            {/* Background */}
            <div className="absolute inset-0 -z-10" style={BLUE_BG} />

            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBack}
                                className="hover:bg-white/10"
                                style={{ color: TEXT_LIGHT }}
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                                style={{ background: "#3B82F6" }}
                            >
                                <Library className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-lg" style={{ color: TEXT_LIGHT }}>
                                Content Library
                            </h1>
                        </div>

                        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    className="bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] text-white rounded-xl px-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Upload Content
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle className="text-[#0F1F47] flex items-center gap-2">
                                        <Upload className="w-5 h-5 text-[#3B82F6]" />
                                        Upload New Content
                                    </DialogTitle>
                                    <DialogDescription className="text-[#0F1F47]/70">
                                        Add a new PDF document to your content library
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-[#0F1F47]">
                                            Title
                                        </Label>
                                        <Input
                                            id="title"
                                            placeholder="Enter content title"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            className="border-[#E5E7EB] focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="className" className="text-[#0F1F47]">
                                            Class Name
                                        </Label>
                                        <Input
                                            id="className"
                                            placeholder="e.g., Grade 5A"
                                            value={newClassName}
                                            onChange={(e) => setNewClassName(e.target.value)}
                                            className="border-[#E5E7EB] focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="file" className="text-[#0F1F47]">
                                            PDF File
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="file"
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleFileUpload}
                                                className="border-[#E5E7EB] focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                                            />
                                            {selectedFile && (
                                                <p className="mt-2 text-sm text-[#0F1F47]/70 flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-[#3B82F6]" />
                                                    {selectedFile.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsUploadDialogOpen(false)}
                                        className="border-[#E5E7EB] text-[#0F1F47] hover:bg-[#F2F3F4]"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleAddContent}
                                        disabled={!newTitle || !newClassName || !selectedFile}
                                        className="bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="w-8 h-8 text-[#FFD600]" />
                        <h2 className="text-3xl" style={{ color: TEXT_LIGHT }}>
                            Your Content Library
                        </h2>
                    </div>
                    <p style={{ color: TEXT_MUTED }}>
                        Manage and view all your uploaded learning materials in one place
                    </p>
                </div>

                {/* Content Table */}
                <Card className="bg-white border-0 shadow-xl">
                    <CardHeader className="border-b border-[#E5E7EB]">
                        <CardTitle className="text-[#0F1F47] flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#3B82F6]" />
                            All Content
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#F2F3F4] hover:bg-[#F2F3F4]">
                                        <TableHead className="text-[#0F1F47]">
                                            Title
                                        </TableHead>
                                        <TableHead className="text-[#0F1F47]">
                                            Class Name
                                        </TableHead>
                                        <TableHead className="text-[#0F1F47]">
                                            Upload Date
                                        </TableHead>
                                        <TableHead className="text-[#0F1F47] text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contentItems.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="text-center py-12 text-[#0F1F47]/50"
                                            >
                                                <FileText className="w-12 h-12 mx-auto mb-3 text-[#0F1F47]/30" />
                                                <p className="mb-2">No content uploaded yet</p>
                                                <p className="text-sm">
                                                    Click the "Upload Content" button to get started
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        contentItems.map((item) => (
                                            <TableRow
                                                key={item.id}
                                                className="hover:bg-[#F8F9FA] transition-colors"
                                            >
                                                <TableCell className="text-[#0F1F47]">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-[#3B82F6]" />
                                                        {item.title}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-[#0F1F47]/70">
                                                    {item.className}
                                                </TableCell>
                                                <TableCell className="text-[#0F1F47]/70">
                                                    {new Date(item.uploadDate).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                className="bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                                                            >
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View PDF
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="bg-white max-w-4xl w-full p-0 overflow-hidden" style={{ maxHeight: '90vh' }}>
                                                            <DialogHeader className="p-6 pb-4 border-b border-[#E5E7EB]">
                                                                <DialogTitle className="text-[#0F1F47] flex items-center gap-2">
                                                                    <FileText className="w-5 h-5 text-[#3B82F6]" />
                                                                    {item.title}
                                                                </DialogTitle>
                                                                <DialogDescription className="text-[#0F1F47]/70">
                                                                    {item.className} • Uploaded on{" "}
                                                                    {new Date(item.uploadDate).toLocaleDateString()}
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="flex-1 overflow-hidden" style={{ height: 'calc(90vh - 140px)' }}>
                                                                <iframe
                                                                    src={item.pdfUrl}
                                                                    className="w-full h-full border-0"
                                                                    title={item.title}
                                                                    allowFullScreen
                                                                />
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="mt-6 bg-gradient-to-br from-[#3B82F6] to-[#00B9FC] border-0 shadow-xl">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-5 h-5 text-[#FFD600]" />
                            </div>
                            <div>
                                <h3 className="text-white mb-1">
                                    Upload Your Own Materials
                                </h3>
                                <p className="text-white/90 text-sm">
                                    Add your presentations, speech notes, and learning materials to practice with personalized content. All files are stored securely and can be accessed anytime.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
