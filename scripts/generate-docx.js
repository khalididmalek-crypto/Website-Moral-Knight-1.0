const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType, LevelFormat, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');

const os = require('os');

const markdownPath = path.join(__dirname, '..', 'src', 'data', 'precheck_tekst.md');
const outputPath = path.join(os.homedir(), 'Desktop', 'MK_Pre_check_AI_Orientatie.docx');

const content = fs.readFileSync(markdownPath, 'utf8');

function createDoc() {
    const sections = [];
    const lines = content.split('\n');
    let children = [];
    let currentList = null;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        if (!line) {
            continue;
        }

        // Horizontal Rule
        if (line === '---') {
            continue;
        }

        // Page Break
        if (line.includes('class="page-break"')) {
            children.push(new Paragraph({ children: [new PageBreak()] }));
            continue;
        }

        // Headers
        if (line.startsWith('## ')) {
            children.push(new Paragraph({
                text: line.replace('## ', ''),
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 }
            }));
            continue;
        }
        if (line.startsWith('### ')) {
            children.push(new Paragraph({
                text: line.replace('### ', ''),
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 150 }
            }));
            continue;
        }

        // Lists (Ordered or Unordered)
        const listMatch = line.match(/^(\d+\.|-|\*)\s+(.*)/);
        if (listMatch) {
            const text = listMatch[2];
            // Simplifying lists for Word - converting to plain paragraphs with indents or using numbering
            // Since we only have a few, we can use simple numbering
            children.push(new Paragraph({
                children: [new TextRun(text)],
                numbering: {
                    reference: line.match(/^\d+/) ? "numbered-list" : "bullet-list",
                    level: 0,
                },
                spacing: { after: 120 }
            }));
            continue;
        }

        // Table detection
        if (line.startsWith('|')) {
            // Very simple markdown table parser for this specific table
            if (line.includes('---')) continue; // Skip separator line
            
            const rows = [];
            let headerRow = null;
            
            // Collect all lines that are part of the table
            const tableLines = [];
            while (i < lines.length && lines[i].trim().startsWith('|')) {
                const l = lines[i].trim();
                if (!l.includes('---')) {
                    tableLines.push(l);
                }
                i++;
            }
            // Move index back by one because the outer loop will increment it
            i--;

            const tableRows = tableLines.map(tLine => {
                const cells = tLine.split('|').filter(c => c.trim() !== '' || tLine.startsWith('|') && tLine.endsWith('|')).map(c => c.trim()).filter((c, idx, arr) => {
                    // Filter out empty cells at start/end if split creates them
                    return true;
                });
                // Fix for split issue
                const actualCells = tLine.split('|').map(s => s.trim()).filter((s, idx, arr) => idx > 0 && idx < arr.length - 1);

                return new TableRow({
                    children: actualCells.map(cellText => new TableCell({
                        children: [new Paragraph({ children: [new TextRun(cellText)] })],
                        width: { size: 100 / actualCells.length, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { style: BorderStyle.SINGLE, size: 1 },
                            bottom: { style: BorderStyle.SINGLE, size: 1 },
                            left: { style: BorderStyle.SINGLE, size: 1 },
                            right: { style: BorderStyle.SINGLE, size: 1 },
                        }
                    }))
                });
            });

            children.push(new Table({
                rows: tableRows,
                width: { size: 100, type: WidthType.PERCENTAGE }
            }));
            continue;
        }

        // Parse TextRuns for bold
        const parseRuns = (text) => {
            const parts = text.split(/(\*\*.*?\*\*)/g);
            return parts.map(part => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return new TextRun({ text: part.slice(2, -2), bold: true });
                }
                return new TextRun(part);
            });
        };

        // Regular Paragraph
        children.push(new Paragraph({
            children: parseRuns(line),
            spacing: { after: 200 }
        }));
    }

    const doc = new Document({
        numbering: {
            config: [
                {
                    reference: "bullet-list",
                    levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
                },
                {
                    reference: "numbered-list",
                    levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
                }
            ]
        },
        sections: [{
            properties: {},
            children: children
        }],
    });

    Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync(outputPath, buffer);
        console.log("DOCX generated at:", outputPath);
    });
}

createDoc();
