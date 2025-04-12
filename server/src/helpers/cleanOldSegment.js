import fs from "fs";
import path from "path";

// Delete old segments in the directory
function cleanOldSegments(directory) {
  const dir = directory || "./streams";
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    files.forEach((file) => {
      if (file.endsWith(".ts")) {
        const filePath = path.join(dir, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting file ${filePath}:`, err);
          } else {
            console.log(`Deleted old segment: ${filePath}`);
          }
        });
      }
    });
  });
}

// Gọi hàm xóa file định kỳ mỗi 1 phút
setInterval(cleanOldSegments, 60000);
