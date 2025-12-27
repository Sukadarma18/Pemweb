/**
 * Script untuk mengekstrak jurnal PDF dan populate journals.json
 * Run: node scripts/extract-journals.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const JURNAL_FOLDER = path.join(__dirname, '../Jurnal Mental Health');
const OUTPUT_FILE = path.join(__dirname, '../src/data/journals.json');

// Fungsi untuk generate ID
function generateId() {
    return crypto.randomBytes(8).toString('hex');
}

// Fungsi untuk ekstrak teks dari nama file
function extractInfoFromFilename(filename) {
    // Hapus ekstensi .pdf
    let name = filename.replace('.pdf', '');
    
    // Clean up nama file
    name = name
        .replace(/[\+\s]+/g, ' ')
        .replace(/_/g, ' ')
        .replace(/\-/g, ' ')
        .replace(/\d+/g, '')
        .trim();
    
    return name;
}

// Fungsi untuk membuat kategori dari nama file
function categorizJournal(filename) {
    const lowerName = filename.toLowerCase();
    
    if (lowerName.includes('anak') || lowerName.includes('remaja') || lowerName.includes('youth')) {
        return 'Kesehatan Mental Anak & Remaja';
    }
    if (lowerName.includes('depresi') || lowerName.includes('depression')) {
        return 'Depresi';
    }
    if (lowerName.includes('cemas') || lowerName.includes('anxiety') || lowerName.includes('gangguan')) {
        return 'Anxiety & Gangguan Cemas';
    }
    if (lowerName.includes('stress') || lowerName.includes('stres')) {
        return 'Stress Management';
    }
    if (lowerName.includes('media sosial') || lowerName.includes('cyberbullying')) {
        return 'Media Sosial & Teknologi';
    }
    if (lowerName.includes('komunikasi') || lowerName.includes('hubungan') || lowerName.includes('sosial')) {
        return 'Hubungan Sosial';
    }
    if (lowerName.includes('tidur') || lowerName.includes('sleep')) {
        return 'Sleep Disorders';
    }
    if (lowerName.includes('makan') || lowerName.includes('eating')) {
        return 'Eating Disorders';
    }
    if (lowerName.includes('komunitas') || lowerName.includes('masyarakat')) {
        return 'Kesehatan Mental Komunitas';
    }
    if (lowerName.includes('pencegahan') || lowerName.includes('prevention') || lowerName.includes('upaya')) {
        return 'Pencegahan & Promosi';
    }
    if (lowerName.includes('psikoedukasi') || lowerName.includes('literasi')) {
        return 'Psikoedukasi & Literasi';
    }
    if (lowerName.includes('generasi') || lowerName.includes('z')) {
        return 'Generasi Z';
    }
    return 'Kesehatan Mental Umum';
}

// Fungsi untuk membuat summary dari nama file
function generateSummary(filename, category) {
    const baseText = extractInfoFromFilename(filename);
    
    const categoryDescriptions = {
        'Kesehatan Mental Anak & Remaja': 'Artikel tentang kesehatan mental pada anak dan remaja',
        'Depresi': 'Penelitian dan informasi tentang depresi dan mood disorders',
        'Anxiety & Gangguan Cemas': 'Studi tentang anxiety disorders dan gangguan kecemasan',
        'Stress Management': 'Materi tentang manajemen stress dan burnout',
        'Media Sosial & Teknologi': 'Pengaruh media sosial dan teknologi terhadap kesehatan mental',
        'Hubungan Sosial': 'Informasi tentang hubungan sosial dan kesehatan mental',
        'Sleep Disorders': 'Penelitian tentang gangguan tidur dan sleep hygiene',
        'Eating Disorders': 'Studi tentang gangguan makan dan nutrition',
        'Kesehatan Mental Komunitas': 'Kesehatan mental di tingkat masyarakat',
        'Pencegahan & Promosi': 'Program pencegahan dan promosi kesehatan mental',
        'Psikoedukasi & Literasi': 'Materi psikoedukasi dan peningkatan literasi mental health',
        'Generasi Z': 'Kesehatan mental khusus generasi Z',
        'Kesehatan Mental Umum': 'Artikel umum tentang kesehatan mental'
    };
    
    return categoryDescriptions[category] || `Artikel: ${baseText}`;
}

// Main function
async function extractJournals() {
    try {
        console.log('📚 Memulai ekstraksi jurnal dari folder...\n');
        
        // Baca semua file PDF dari folder
        const files = fs.readdirSync(JURNAL_FOLDER);
        const pdfFiles = files.filter(f => f.endsWith('.pdf'));
        
        console.log(`✓ Ditemukan ${pdfFiles.length} file PDF\n`);
        
        const journals = [];
        
        // Process setiap file
        pdfFiles.forEach((filename, index) => {
            const filePath = path.join(JURNAL_FOLDER, filename);
            const stats = fs.statSync(filePath);
            
            const category = categorizJournal(filename);
            const title = extractInfoFromFilename(filename) || filename.replace('.pdf', '');
            const summary = generateSummary(filename, category);
            
            // Generate content snippet dari filename (karena ekstraksi PDF memerlukan library tambahan)
            const contentSnippet = `Jurnal: ${filename}\nKategori: ${category}\nFile dipublikasikan sebagai bagian dari koleksi referensi kesehatan mental.\n\nFile ini berisi penelitian dan informasi terkait: ${category.toLowerCase()}. Untuk informasi lengkap, silakan baca dokumen PDF secara langsung.`;
            
            const journal = {
                id: generateId(),
                filename: filename,
                title: title || 'Jurnal Kesehatan Mental',
                content: contentSnippet,
                summary: summary,
                author: 'Penelitian & Referensi',
                category: category,
                fileSize: stats.size,
                addedDate: new Date().toISOString()
            };
            
            journals.push(journal);
            
            console.log(`${index + 1}. ✓ ${filename}`);
            console.log(`   Kategori: ${category}\n`);
        });
        
        // Simpan ke journals.json
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(journals, null, 2), 'utf-8');
        
        console.log(`\n✅ Berhasil! ${journals.length} jurnal telah disimpan ke journals.json`);
        console.log(`📁 File tersimpan di: ${OUTPUT_FILE}`);
        
    } catch (error) {
        console.error('❌ Error saat ekstraksi jurnal:', error.message);
        process.exit(1);
    }
}

// Run
extractJournals();
