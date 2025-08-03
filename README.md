🚀 Remote Background Job Execution System
🧠 Description
This project allows you to run background jobs on a remote server, manage them from a web interface, and stream real-time logs.

* [backend url](https://github.com/error404-sp/joblog-backend)
It includes:

Job Manager UI – Create, monitor, and stop jobs (commands or scripts).

Live Logs Viewer – View logs across all jobs in real-time.

Job Details Page – See output, logs, parameters, and status of each job.

Remote Execution – All jobs are executed as background tasks on a remote instance in worker threads.

🖥️ Frontend (frontend/)
Built with React + Vite

Uses Context API for global state (jobs, logs, health)

Dark-themed, minimal UI inspired by terminal dashboards

🔧 Installation

```
cd execution-joblog
npm install
npm run dev
```
