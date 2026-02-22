// GitHub API Service for Serverless Database Configuration

// In a real production SPA, you MUST NOT hardcode a Personal Access Token (PAT).
// For this Admin panel, we will store the PAT in memory/localStorage temporarily
// upon the "Admin Login", which is just entering the GitHub Token.

class GitHubDB {
    constructor() {
        // Obtenemos el token guardado temporalmente.
        this.token = localStorage.getItem('github_pat') || '';
        this.owner = 'santillandelicia'; // Updated owner
        this.repo = 'Tienda-online-Dly'; // Updated repo
        this.path = 'productos.json';
        this.branch = 'main'; // O la rama que uses (master, main)
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('github_pat', token);
    }

    getToken() {
        return this.token;
    }

    clearToken() {
        this.token = '';
        localStorage.removeItem('github_pat');
    }

    get headers() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        };
    }

    async getFile() {
        const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.path}?ref=${this.branch}`;
        try {
            const response = await fetch(url + '&t=' + new Date().getTime(), {
                headers: this.token ? this.headers : { 'Accept': 'application/vnd.github.v3+json' }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    // Archivo no existe aún
                    return { content: [], sha: null };
                }
                throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            // El contenido de GitHub viene en Base64
            const decodedContent = decodeURIComponent(escape(atob(data.content)));

            return {
                content: JSON.parse(decodedContent),
                sha: data.sha
            };
        } catch (error) {
            console.error("Error fetching file:", error);
            throw error;
        }
    }

    async updateFile(newContentArray, currentSha, commitMessage = "Actualización de catálogo de productos") {
        if (!this.token) {
            throw new Error("No hay token de GitHub configurado. Inicia sesión como Admin primero.");
        }

        const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.path}`;

        // Convertimos a JSON string y luego a Base64
        const contentString = JSON.stringify(newContentArray, null, 2);
        // Base64 seguro para UTF-8:
        const base64Content = btoa(unescape(encodeURIComponent(contentString)));

        const body = {
            message: commitMessage,
            content: base64Content,
            branch: this.branch,
            ...(currentSha && { sha: currentSha })
        };

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: this.headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(`GitHub API Error: ${response.status} - ${errData.message || response.statusText}`);
            }

            const data = await response.json();
            return data.content.sha; // Nuevo SHA generado
        } catch (error) {
            console.error("Error updating file:", error);
            throw error;
        }
    }
}

// Global instance to use across our React App
window.githubDB = new GitHubDB();
