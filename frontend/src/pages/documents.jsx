import { useState } from "react";
import api from "../api/vendorAxios";
import { toast } from "react-toastify";

const Documents = () => {
  const [file, setFile] = useState(null);
  const [type, setType] = useState("");

  const upload = async () => {
    if (!file || !type) {
      return toast.error("Select document type and file");
    }

    const data = new FormData();
    data.append("file", file);
    data.append("type", type);

    await api.post("/vendors/upload-document", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Document uploaded successfully");
    setFile(null);
    setType("");
  };

  return (
    <div className="p-6">
      <div className="card max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-6">
          Upload Documents
        </h2>

        {/* 🔹 Floating Label Select */}
        <div className="relative mb-5">
          <select
            id="documentType"
            value={type}
            required
            onChange={(e) => setType(e.target.value)}
            className="
              peer
              input
              pt-6
              focus:outline-none
            "
          >
            <option value="" disabled hidden></option>
            <option value="gstCert">GST Certificate</option>
            <option value="panCard">PAN Card</option>
            <option value="license">License</option>
            <option value="certification">Certification</option>
          </select>

          <label
            htmlFor="documentType"
            className="
              absolute left-3
              text-gray-400
              transition-all duration-200

              top-4 text-base

              peer-focus:top-2
              peer-focus:text-sm
              peer-focus:text-blue-600
              peer-focus:font-medium

              peer-valid:top-2
              peer-valid:text-sm
            "
          >
            Document Type
          </label>
        </div>

        {/* 🔹 File Input (Normal Label – Best UX) */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Upload File
          </label>
          <input
            id="documentFile"
            type="file"
            className="input"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button
          onClick={upload}
          className="btn btn-primary w-full"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default Documents;
