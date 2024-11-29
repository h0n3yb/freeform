import { NewPieceForm } from '@/components/pieces/new-piece-form';

export default function NewPiecePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Document New Piece</h1>
        <div className="bg-card rounded-lg shadow-sm p-6">
          <NewPieceForm />
        </div>
      </div>
    </div>
  );
} 