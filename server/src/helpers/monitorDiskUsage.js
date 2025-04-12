import { exec } from "child_process";

export default function monitorDiskUsage(directory) {
  const dir = directory || "./streams";
  exec(`du -sh ${dir}`, (err, stdout, stderr) => {
    if (err) {
      console.error("Error checking disk usage:", err);
      return;
    }
    console.log(`Disk usage for streams: ${stdout}`);
  });
}
