import { load } from "rag-lite-engine";

// Your existing upload controller
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;

    // 🔥 Load into RAG engine
    await load(filePath, {
      metadata: {
        userId: req.user?.id || "anonymous",
        fileName: req.file.originalname,
        type: "document",
        uploadedAt: new Date().toISOString(),
      },
    });

    return res.status(200).json({
      message: "File uploaded and indexed successfully",
      file: req.file.originalname,
    });
  } catch (error) {
    console.error("Upload + RAG error:", error);
    return res.status(500).json({
      message: "Error uploading file",
      error: error.message,
    });
  }
};