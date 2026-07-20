import mongoose from 'mongoose';

const scriptSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, default: '' },
  excerpt: { type: String, default: '' },
  status: { type: String, enum: ['Draft', 'Recording', 'Published'], default: 'Draft' },
  tags: [{ type: String, trim: true }],
  scriptLanguage: { type: String, default: 'Hinglish' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

scriptSchema.index(
  { title: 'text', excerpt: 'text', content: 'text', tags: 'text' },
  { default_language: 'none', language_override: 'searchLanguage' }
);
export default mongoose.model('Script', scriptSchema);
