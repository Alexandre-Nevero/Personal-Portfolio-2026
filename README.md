# 🚀 Complete Beginner's Guide: Personalizing Your AI Portfolio

## Portfolio Template on Cloud Run

Plain HTML/CSS/JavaScript portfolio template served by Cloud Run, with private media assets stored in Cloud Storage and served through the Cloud Run domain, plus a Gemini 2.5 Flash-Lite chatbot endpoint.

## Architecture

- **Cloud Run** serves the portfolio, proxies `/assets`, and owns `/api/chat`.
- **Cloud Storage** stores the media assets privately; Cloud CDN can be added in front of `/assets` later if you front the bucket with an HTTPS load balancer.
- **Secret Manager** stores `GEMINI_API_KEY`.
- **Cloud Build** builds and pushes the container image to Artifact Registry.
- **Gemini API** uses `gemini-2.5-flash-lite` to answer from the Markdown knowledge base.
- **Markdown knowledge base** lives at `public/context.md`.
---

## 🛠 What is in this project?
Think of your portfolio like a house:
*   **`index.html`**: The structure (walls, doors, windows). This is where your text and links live.
*   **`styles.css`**: The paint and furniture. This makes the site look pretty and "glassy."
*   **`context.md`**: The brain of your house. This file tells your AI Chatbot who you are and what you do.
*   **`assets/`**: Your photo album. This is where your profile picture and project images live.

---

## 📖 Glossary of Terms for Beginners
If you're new to coding, here are some terms you'll see in this guide:
*   **Repository (Repo)**: A folder where your code is saved and tracked, often hosted on the internet (like GitHub).
*   **Clone**: Downloading a complete copy of a repository from the internet to your local computer.
*   **Terminal / Command Line**: A text-based interface where you type commands to talk to your computer instead of clicking with a mouse.
*   **Node.js**: The engine that allows JavaScript to run on your computer, necessary for building and running this project locally.
*   **API Key**: A secret password that lets your website talk to an external service (in this case, the Gemini AI).
*   **Markdown (`.md`)**: A simple way to format text using symbols (like `#` for headings or `-` for lists).
*   **HTML**: The skeleton or structure of a website (where your text and links live).
*   **CSS**: The styling of a website (colors, spacing, and animations).
*   **WebP**: A modern image format that makes images smaller in file size so they load faster.
*   **Deployment**: Moving your site from your local computer to a server on the internet so anyone can visit it.
*   **Cloud Run / Cloud Storage**: Google Cloud services used to host your website and store your images securely.

---

## 📥 Prerequisites: Getting the Code & Git Basics
Before setting up your workshop, you need to get the code onto your machine.

### 1. Clone the Repository
Open a terminal and clone the repository to your local machine:
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### 2. Basic Git Commands (Pushing Your Changes)
As you customize your portfolio, you'll want to save and push your changes to your own GitHub repository from time to time. Remember the following commands if you want to push the changes you've made:
```bash
# Add all your changes
git add .

# Commit your changes with a message
git commit -m "Update portfolio content and styles"

# Push your changes to your repository
git push origin main
```

---

## 🏁 Phase 1: Setting Up Your Workshop
To see your changes as you make them, you need to run the site on your computer.

### 1. Install the Engine
You need **Node.js**. If you don't have it, download the "LTS" version from [nodejs.org](https://nodejs.org/).

### 2. Open Your Project
Open your code editor (like VS Code) and open this folder. Open a **Terminal** (usually `Ctrl + ` ` or `Terminal > New Terminal`).

### 3. Install Dependencies
In the terminal, type this and hit Enter:
```bash
npm install
```

### 4. Add Your API Key (The Chatbot's Power)
Go to [Google AI Studio](https://aistudio.google.com/) and get a free API Key. Then, tell your computer to use it:
*   **Windows (PowerShell):** `$env:GEMINI_API_KEY="PASTE_YOUR_KEY_HERE"`
*   **Mac/Linux:** `export GEMINI_API_KEY="PASTE_YOUR_KEY_HERE"`

### 5. Start the Preview
Type this:
```bash
npm run dev
```
Now, go to `http://localhost:8080` in your browser. **Keep this terminal open!** The site will update as you save files.

---

## ✍️ Phase 2: Training Your AI Chatbot (`context.md`)
This is the most important part for your "AI" portfolio. The chatbot answers questions based **ONLY** on this file.

1.  Open `public/context.md`.
2.  **The Profile Section:**
    *   Find `# Profile`. Change "Bryl Lim" to your name.
    *   Describe your current role. Use plain English like: *"I am a graphic designer based in New York."*
3.  **The Knowledge Base:**
    *   Add a `## Experience` section. Use dashes `-` for lists.
    *   *Example:* `- 2023-Present: Junior Developer at TechCorp.`
4.  **The Secret Sauce:**
    *   If you want the AI to be funny, professional, or direct, write a small "Instructions" section at the top of the file.

> [!TIP]
> If someone asks the chatbot "What is your favorite color?", and it's not in this file, the AI will say "I don't know." **If it's important, put it in the Markdown!**

---

## 🏗 Phase 3: Updating the Website (`index.html`)
This file controls what people see when they land on your page.

### 1. Changing Your Name
Search (Ctrl+F) for `<title>`. Change the text inside to `Your Name | Portfolio`.

### 2. Updating Sections
Look for code that looks like this:
```html
<section id="about">
  <h2>About Me</h2>
  <p>I am a software engineer...</p>
</section>
```
Simply change the text between the `<p>` and `</p>` tags. 

### 3. Adding Projects
Find the `id="projects"` section. You will see "Project Cards." To add a new one, copy an existing `<div class="project-card">` block and paste it right below. Then, change the title and link.

---

## 🎨 Phase 4: Changing Colors & Style (`styles.css`)
You don't need to know complex CSS. We use "Variables" at the very top of `public/styles.css`.

1.  Open `public/styles.css`.
2.  Find the `:root` section (Lines 1-15).
3.  Change these values:
    *   `--primary`: The main "accent" color (buttons, borders).
    *   `--background`: The color of the page.
    *   `--glass-bg`: The transparency of the cards.

**Pro Tip:** Use a "Hex Color Picker" on Google to find codes like `#6366f1` (Indigo) or `#ef4444` (Red).

---

## 🖼 Phase 5: Swapping Images
1.  **Your Profile Picture:**
    *   Find a photo of yourself.
    *   Rename it to `profile.webp` (or `profile.jpg`).
    *   Drop it into the `public/assets/` folder, replacing the old one.
2.  **Updating the Code:**
    *   If you used a `.jpg`, go to `index.html` and search for `profile.webp`. Change it to `profile.jpg`.

---

## 🚀 Phase 6: Going Live (Deployment)
## GCP Deployment Guide

This is the recommended Cloud Shell workflow.

### 1. Prepare the GCP project

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Select or create a project.
3. Enable billing.
4. Open **Cloud Shell**.
5. Check the active project:

```bash
gcloud config get-value project
```

6. If needed, switch to the right project:

```bash
gcloud config set project "your-project-id"
```

### 2. Get the source code into Cloud Shell

Recommended GitHub flow:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

Alternative ZIP upload flow:

1. In Cloud Shell, click **More** > **Upload**.
2. Upload the ZIP.
3. Run:

```bash
unzip portfolio.zip
cd portfolio
```

The repo should contain `Dockerfile`, `server.js`, `package.json`, `public/`, and `deploy-cloudshell.sh`.

### 3. Edit the template content

Before deploying, customize these files:

- `public/index.html`: visible page content
- `public/context.md`: chat knowledge base
- `public/assets`: profile image, gallery images, favicon files, and other public media
- `public/styles.css`: visual styling

Open the editor in Cloud Shell with:

```bash
cloudshell edit public/context.md
```

Do not place secrets in repo files. The Gemini API key should be stored in Secret Manager or entered at deploy time.

### 4. Deploy to Cloud Run

The deploy script creates or reuses the Google Cloud resources and deploys the service.

Interactive form:

```bash
chmod +x ./deploy-cloudshell.sh && ./deploy-cloudshell.sh --project "your-project-id"
```

Non-interactive form:

```bash
export GEMINI_API_KEY="your-gemini-api-key"
chmod +x ./deploy-cloudshell.sh && ./deploy-cloudshell.sh --project "your-project-id"
```

With custom settings:

```bash
export GEMINI_API_KEY="your-gemini-api-key"
export GEMINI_MODEL="gemini-2.5-flash-lite"
export CHAT_RATE_LIMIT="10"
export GLOBAL_RATE_LIMIT="500"

chmod +x ./deploy-cloudshell.sh && ./deploy-cloudshell.sh \
  --project "your-project-id" \
  --region "asia-southeast1" \
  --service "bryl" \
  --bucket "your-project-id-bryllim-assets"
```

### 5. What gets created

The deploy script creates or reuses:

- Cloud Run service: `bryl`
- Cloud Storage bucket: `<project-id>-bryllim-assets`
- Secret Manager secret: `gemini-api-key`
- Artifact Registry repository: `bryllim`
- Required APIs: Cloud Run, Cloud Build, Artifact Registry, Secret Manager, Cloud Storage

It also:

- uploads `public/assets` to a private Cloud Storage bucket
- serves assets through Cloud Run at `/assets`
- sets long-lived cache headers on asset objects
- deploys Cloud Run with public access
- injects `GEMINI_API_KEY` from Secret Manager

### 6. Verify the deployment

The script prints:

```text
Service URL: https://...
Asset URL:   /assets
```

Check the service:

```bash
curl "$(gcloud run services describe bryl --region asia-southeast1 --format='value(status.url)')/healthz"
```

Expected:

```json
{"ok":true}
```

Open the service URL and verify the page, gallery, and chat. CONGRATS! YOU JUST UPLOADED YOUR PORTFOLIO IN GCP!

---

## 7: Cleaning Up (Avoiding Costs)

When you are done showing off the demo, you should delete the resources. This stops Google Cloud from charging you money.

### Option 1: Delete the whole project (Easiest & Safest)

If you made a brand new Google Cloud project just for this portfolio, the best way to stop all charges is to delete the entire project at once.

Run this command in Cloud Shell:

```bash
gcloud projects delete "your-project-id"

```

*Note: This will permanently delete everything inside the project.*

### Option 2: Delete specific services

If you used an existing project and want to keep it, you must delete the specific parts the script built. Run these commands in Cloud Shell:

**1. Delete the Cloud Run service:**

```bash
gcloud run services delete bryl --region asia-southeast1

```

**2. Delete the Cloud Storage bucket:**

```bash
gcloud storage rm --recursive gs://your-project-id-bryllim-assets

```

**3. Delete the Artifact Registry repository:**

```bash
gcloud artifacts repositories delete bryllim --location asia-southeast1

```

**4. Delete the Secret (Gemini API Key):**

```bash
gcloud secrets delete gemini-api-key

```

**5. Delete the Load Balancer (If you added Cloud CDN):**
If you did the extra step to add Cloud CDN, go to your Google Cloud Console, search for **Cloud CDN** and **Load Balancing**, and delete the ones you created.


## This phase is optional. Applicable when you want to make new changes to your site.

After changes:

```bash
git pull
./deploy-cloudshell.sh --project "your-project-id"
```

To skip media re-upload:

```bash
./deploy-cloudshell.sh --project "your-project-id" --skip-assets
```

## Add Cloud CDN for assets

Use this if you want faster image delivery without exposing the bucket directly.

1. Keep Cloud Run serving the HTML and `/api/chat`.
2. Keep `public/assets` in the private Cloud Storage bucket.
3. Create an HTTPS load balancer with a **backend bucket** pointing to that bucket.
4. Enable **Cloud CDN** on the backend bucket.
5. Set `ASSET_BASE_URL` to the CDN hostname, for example `https://cdn.example.com`.
6. Redeploy so `public/index.html` and `/config.js` use the CDN URL for asset links.

Notes:
- Keep `Cache-Control` headers long-lived on asset objects.
- Do not make the bucket public if you want the CDN to remain the only public path.
- If you change asset URLs later, invalidate the CDN cache for the affected paths.

---

## Updating The Site

After changing repo files, redeploy from Cloud Shell:

```bash
./deploy-cloudshell.sh --project "your-project-id"
```

The script is idempotent. It reuses existing GCP resources, uploads the latest assets, creates a new Gemini secret version if `GEMINI_API_KEY` is provided, rebuilds the image, and deploys a new Cloud Run revision.

If your code lives in GitHub, the normal update flow is:

```bash
git pull
./deploy-cloudshell.sh --project "your-project-id"
```

To skip re-uploading assets:

```bash
./deploy-cloudshell.sh --project "your-project-id" --skip-assets
```

## Configuration

Runtime environment variables:

- `GEMINI_API_KEY`: Gemini API key. Set through Secret Manager by the deploy script.
- `GEMINI_MODEL`: Gemini chat model. Defaults to `gemini-2.5-flash-lite`.
- `ASSET_BASE_URL`: asset path. Defaults to `/assets`.
- `ASSET_BUCKET_NAME`: private Cloud Storage bucket used by Cloud Run to serve media.
- `GLOBAL_RATE_LIMIT`: requests per visitor window across the site. Defaults to `500`.
- `GLOBAL_RATE_LIMIT_WINDOW_MS`: global limiter window. Defaults to `900000`.
- `CHAT_RATE_LIMIT`: chat messages per visitor window. Defaults to `10`.
- `CHAT_RATE_LIMIT_WINDOW_MS`: chat limiter window. Defaults to `60000`.
- `CHAT_MAX_MESSAGES`: max recent chat messages forwarded to Gemini. Defaults to `8`.
- `CHAT_MAX_MESSAGE_LENGTH`: max characters per chat message. Defaults to `800`.
- `ALLOWED_CHAT_ORIGINS`: optional comma-separated list of allowed browser origins for `/api/chat`; same-origin is allowed automatically.
- `PORT`: supplied automatically by Cloud Run. Defaults to `8080` locally.

## Local Development

```powershell
npm install
$env:GEMINI_API_KEY="your-gemini-api-key"
npm run dev
```

Open `http://localhost:8080`.

Without `GEMINI_API_KEY`, the portfolio still works and `/api/chat` returns a setup message.

## Security Notes

- Gemini API keys are stored in Secret Manager and injected into Cloud Run only at runtime.
- Chat uses `gemini-2.5-flash-lite` with `public/context.md` as strict context.
- Chat also applies Gemini safety settings for harassment, hate speech, sexual content, and dangerous content.
- `/api/chat` is protected by same-origin checks, JSON body size limits, global rate limiting, and chat-specific rate limiting.
- Rate limiting is in Cloud Run instance memory. For stronger multi-instance abuse protection, add Cloud Armor, reCAPTCHA/Turnstile, or a shared Redis-backed limiter.
- Cloud Storage is private; Cloud Run reads media from it and serves the files from the app domain.
- For stricter production IAM, replace the default Cloud Run runtime service account with a dedicated service account that can access only the Gemini secret.

## Troubleshooting

### Browser Console: Content Security Policy blocks inline script

The app uses a strict CSP with per-request nonces. If you see this after deployment, redeploy the latest code so Cloud Run serves `index.html` through `server.js`; opening `public/index.html` directly or serving it from a plain static host will leave the `__CSP_NONCE__` placeholder unresolved.

### Chat returns `500`

Check Cloud Run logs first:

```bash
gcloud run services logs read bryl --region asia-southeast1 --limit 50
```

Common causes:

- `GEMINI_API_KEY` is missing, invalid, or has no Gemini API access.
- `public/context.md` is missing from the deployed container.
- The selected Gemini model is unavailable for the API key/project. Default is `gemini-2.5-flash-lite`.
- Gemini quota or rate limits were exceeded.

### Update chatbot knowledge

Edit `public/context.md`, then redeploy:

```bash
./deploy-cloudshell.sh --project "your-project-id"
```

The chatbot is instructed to answer only from this Markdown file and refuse unknown topics instead of inventing facts.

## Convert Images To WebP

Most portfolio media should be WebP before deployment:

```bash
npm install
npm run assets:webp
```

The script converts PNG files under `public/assets` to WebP and skips `public/assets/favicons`.

