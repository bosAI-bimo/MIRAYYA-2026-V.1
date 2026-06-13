const fs = require('fs');
const path = require('path');

const dashboardDir = path.join(__dirname, 'src', 'app', 'dashboard');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // For manual divs acting as cards
            content = content.replace(/className="([^"]*)border border-slate-200([^"]*)"/g, (match, p1, p2) => {
                // if it already has border-2, skip
                if (p1.includes('border-2') || p2.includes('border-2')) return match;
                return `className="${p1}border-2 border-slate-200${p2}"`;
            });

            // For <Card> components
            content = content.replace(/<Card className="([^"]*)"/g, (match, p1) => {
                if (p1.includes('border-2')) return match;
                // If it has border-slate-200, ensure it has border-2
                if (p1.includes('border-slate-200')) {
                    // if it explicitly has "border ", replace it with "border-2 "
                    if (p1.includes('border ')) {
                        return `<Card className="${p1.replace('border ', 'border-2 ')}"`;
                    }
                    return `<Card className="border-2 ${p1}"`;
                }
                // Just add border-2 if it's a Card
                return `<Card className="border-2 border-slate-200 ${p1}"`;
            });
            
            // For <Card> without className
            content = content.replace(/<Card>/g, `<Card className="border-2 border-slate-200">`);

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

processDirectory(dashboardDir);
console.log("Done");
