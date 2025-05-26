import { AnimateStagger } from '@/components/AnimateOnView';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/helpers';
import { useTranslations } from '@/hooks/useTranslation';
import type { SharedData } from '@/types';
import { type Comment, Post } from '@/types/blog';
import { router, usePage } from '@inertiajs/react';
import { Clock, Shield, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CommentCard({ comment, post }: { comment: Comment; post: Post }) {
    const { __, locale } = useTranslations();
    const { auth } = usePage<SharedData>().props;
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);

        router.delete(route('blog.comments.destroy', { comment: comment.id, locale, post: post.slug }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(__('Comment deleted successfully'));
                setIsDeleting(false);
            },
            onError: () => {
                toast.error(__('Failed to delete comment'));
                setIsDeleting(false);
            },
        });
    };

    const getAuthorInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const isOwner = comment.author.id === auth.user?.id;

    return (
        <Card className="group border-border/40 bg-card/50 hover:border-border hover:bg-card hover:shadow-primary/5 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            <AnimateStagger animation="fade-left" stagger={100}>
                <CardContent className="p-0">
                    {/* Header z avatarem i informacjami o autorze */}
                    <div className="flex items-start justify-between p-4 pb-2">
                        <div className="flex items-center gap-3">
                            <Avatar className="ring-background h-8 w-8 shadow-sm ring-2">
                                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                                <AvatarFallback className="from-primary/20 to-primary/10 bg-gradient-to-br text-xs font-medium">
                                    {getAuthorInitials(comment.author.name)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-foreground text-sm font-medium">{comment.author.name}</span>
                                    {comment.author.admin && (
                                        <Badge variant="default" className="flex items-center gap-1">
                                            <Shield className="mr-1 h-3 w-3" />
                                            {__('Admin')}
                                        </Badge>
                                    )}
                                </div>

                                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                                    <Clock className="h-3 w-3" />
                                    <time dateTime={comment.created_at}>{formatDate(comment.created_at, locale)}</time>
                                </div>
                            </div>
                        </div>

                        {/* Przycisk usuwania */}
                        {isOwner && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" disabled={isDeleting}>
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">{__('Delete comment')}</span>
                                    </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent className="max-w-md">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="flex items-center gap-2">
                                            <Trash2 className="text-destructive h-5 w-5" />
                                            {__('Delete Comment')}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-left">
                                            {__('Are you sure you want to delete this comment? This action cannot be undone.')}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel>{__('Cancel')}</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="bg-destructive hover:bg-destructive/90 focus:ring-destructive"
                                        >
                                            {isDeleting ? __('Deleting...') : __('Delete')}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>

                    {/* Treść komentarza */}
                    <div className="px-4 pb-4">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-foreground m-0 leading-relaxed">{comment.content}</p>
                        </div>
                    </div>

                    {/* Dolna linia z subtle gradient */}
                    <div className="via-border h-px bg-gradient-to-r from-transparent to-transparent opacity-50" />
                </CardContent>
            </AnimateStagger>
        </Card>
    );
}
