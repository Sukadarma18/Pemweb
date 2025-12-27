// Script to import PDF journals into the knowledge base
// Run with: node scripts/import-journals.js

const fs = require('fs');
const path = require('path');

// Try to import pdf-parse
let pdfParse;
try {
    pdfParse = require('pdf-parse');
} catch (e) {
    console.error('Error: pdf-parse not installed. Run: npm install pdf-parse');
    process.exit(1);
}

const JOURNALS_PATH = path.join(process.cwd(), 'Jurnal Mental Health');
const OUTPUT_PATH = path.join(process.cwd(), 'src', 'data', 'journals.json');

// Extract metadata from PDF content
function extractMetadata(text, filename) {
    const lines = text.split('\n').filter(line => line.trim().length > 0);

    // Extract title
    let title = filename.replace('.pdf', '').replace(/[+_]/g, ' ').trim();
    for (let i = 0; i < Math.min(10, lines.length); i++) {
        const line = lines[i].trim();
        if (line.length > 20 && line.length < 200 && !line.match(/^(vol|volume|jurnal|page|hal|issn)/i)) {
            title = line;
            break;
        }
    }

    // Extract author
    let author = 'Penulis Tidak Diketahui';
    const authorMatch = text.match(/(?:oleh|by|penulis|author)[:\s]+([^\n]+)/i);
    if (authorMatch && authorMatch[1]) {
        author = authorMatch[1].trim().slice(0, 100);
    }

    // Extract summary from abstract
    let summary = '';
    const abstractMatch = text.match(/(?:abstrak|abstract)[:\s]*([^]*?)(?:kata kunci|keywords|pendahuluan|introduction|\n\n)/i);
    if (abstractMatch && abstractMatch[1]) {
        summary = abstractMatch[1].trim().slice(0, 500);
    } else {
        summary = lines.slice(5, 15).join(' ').slice(0, 500);
    }

    return { title, author, summary };
}

// Determine category
function determineCategory(text) {
    const lowerText = text.toLowerCase();

    const categories = {
        'anxiety': ['anxiety', 'kecemasan', 'cemas', 'stress', 'stres', 'anxious', 'khawatir', 'gelisah', 'panik'],
        'depression': ['depression', 'depresi', 'sedih', 'depressed', 'murung', 'hopeless', 'putus asa'],
        'mindfulness': ['mindfulness', 'meditasi', 'meditation', 'relaksasi', 'relaxation', 'tenang'],
        'relationships': ['hubungan', 'relationship', 'keluarga', 'family', 'sosial', 'social', 'pernikahan'],
        'self-care': ['self-care', 'perawatan diri', 'kesejahteraan', 'wellbeing', 'self care'],
        'therapy': ['terapi', 'therapy', 'konseling', 'counseling', 'psikolog', 'psikiater', 'intervensi'],
        'child-mental-health': ['anak', 'remaja', 'child', 'adolescent', 'youth', 'generasi z', 'pelajar', 'mahasiswa'],
        'digital-mental-health': ['sosial media', 'social media', 'digital', 'cyberbullying', 'internet', 'online'],
    };

    let maxScore = 0;
    let bestCategory = 'general';

    for (const [category, keywords] of Object.entries(categories)) {
        let score = 0;
        for (const keyword of keywords) {
            const regex = new RegExp(keyword, 'gi');
            const matches = lowerText.match(regex);
            if (matches) score += matches.length;
        }
        if (score > maxScore) {
            maxScore = score;
            bestCategory = category;
        }
    }

    return bestCategory;
}

async function importJournals() {
    console.log('📚 Memulai import jurnal...\n');

    // Check if folder exists
    if (!fs.existsSync(JOURNALS_PATH)) {
        console.error(`❌ Folder tidak ditemukan: ${JOURNALS_PATH}`);
        return;
    }

    // Get PDF files
    const files = fs.readdirSync(JOURNALS_PATH).filter(f => f.toLowerCase().endsWith('.pdf'));
    console.log(`📁 Ditemukan ${files.length} file PDF\n`);

    const journals = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
        const filename = files[i];
        process.stdout.write(`[${i + 1}/${files.length}] Memproses: ${filename.slice(0, 40)}... `);

        try {
            const filePath = path.join(JOURNALS_PATH, filename);
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);

            const { title, author, summary } = extractMetadata(data.text, filename);
            const category = determineCategory(data.text);

            journals.push({
                title: title.slice(0, 200),
                content: data.text,
                summary: summary || title,
                category,
                filename
            });

            console.log('✓');
        } catch (err) {
            console.log('✗');
            errors.push(`${filename}: ${err.message}`);
        }
    }

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save to JSON for backup
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(journals, null, 2));

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Berhasil diproses: ${journals.length} jurnal`);
    console.log(`💾 Backup JSON: ${OUTPUT_PATH}`);

    // UPLOAD TO API
    console.log('\n🚀 Mengupload data ke Database SQL via API...');
    console.log('(Pastikan server Next.js berjalan di http://localhost:4000)');

    let uploadedCount = 0;
    for (const journal of journals) {
        try {
            const res = await fetch('http://localhost:4000/api/knowledge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: journal.title,
                    summary: journal.summary,
                    content: journal.content,
                    category: journal.category,
                    type: 'JOURNAL',
                    authorId: 'system-import' // Simplified ID since we don't have auth token in script
                })
            });

            if (res.ok) {
                uploadedCount++;
            } else {
                console.log(`  ❌ Gagal upload ${journal.filename.slice(0, 20)}...: ${res.status} ${res.statusText}`);
            }
        } catch (e) {
            console.log(`  ❌ Gagal koneksi API: ${e.message}`);
            break; // Stop if server is down
        }
    }

    if (uploadedCount > 0) {
        console.log(`\n🎉 SUKSES! ${uploadedCount} jurnal telah dimasukkan ke Database SQL.`);
        console.log('Chatbot AI sekarang bisa menggunakan data ini!');
    } else {
        console.log('\n⚠️  Gagal mengupload ke Database via API. Pastikan `npm run dev` berjalan!');
    }
}

importJournals().catch(console.error);
