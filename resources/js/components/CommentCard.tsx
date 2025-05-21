import { AnimateStagger } from '@/components/AnimateOnView';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/helpers';
import { useTranslations } from '@/hooks/useTranslation';
import { type Comment } from '@/types/blog';

export default function CommentCard({ comment }: { comment: Comment }) {
    const { __, locale } = useTranslations();
    return (
        <Card key={comment.id} className="border-primary/10 mb-2 flex flex-col overflow-hidden transition-all hover:shadow-md">
            <AnimateStagger animation="fade-left" stagger={100}>
                <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium">{comment.author.name}</span>
                        <span className="text-muted-foreground text-xs">{formatDate(comment.created_at, locale)}</span>
                    </div>
                    <h3 className="mb-2 font-semibold">{comment.content}</h3>
                </div>
            </AnimateStagger>
        </Card>
    );
}
