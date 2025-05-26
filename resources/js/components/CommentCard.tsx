import { AnimateStagger } from '@/components/AnimateOnView';
import { Card, CardContent } from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate } from '@/helpers';
import { useTranslations } from '@/hooks/useTranslation';
import { type Comment, Post } from '@/types/blog';
import { Badge } from '@/components/ui/badge';
import { Trash2, Clock, Shield } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import type { SharedData } from '@/types';
import { useState } from 'react';

export default function CommentCard({ comment, post }: { comment: Comment, post: Post }) {
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
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const isOwner = comment.author.id === auth.user?.id;

    return (
        <Card className="group border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card hover:shadow-lg hover:shadow-primary/5">
            <AnimateStagger animation="fade-left" stagger={100}>
                <CardContent className="p-0">
                    {/* Header z avatarem i informacjami o autorze */}
                    <div className="flex items-start justify-between p-4 pb-2">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 ring-2 ring-background shadow-sm">
                                <AvatarImage
                                    src={comment.author.avatar}
                                    alt={comment.author.name}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-xs font-medium">
                                    {getAuthorInitials(comment.author.name)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm text-foreground">
                                        {comment.author.name}
                                    </span>
                                    {comment.author.admin && (
                                        <Badge
                                            variant="default"
                                            className="flex items-center gap-1"
                                        >
                                            <Shield className="w-3 h-3 mr-1" />
                                            {__('Admin')}
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <time dateTime={comment.created_at}>
                                        {formatDate(comment.created_at, locale)}
                                    </time>
                                </div>
                            </div>
                        </div>

                        {/* Przycisk usuwania */}
                        {isOwner && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={isDeleting}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">{__('Delete comment')}</span>
                                    </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent className="max-w-md">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="flex items-center gap-2">
                                            <Trash2 className="h-5 w-5 text-destructive" />
                                            {__('Delete Comment')}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-left">
                                            {__('Are you sure you want to delete this comment? This action cannot be undone.')}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            {__('Cancel')}
                                        </AlertDialogCancel>
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
                            <p className="text-foreground leading-relaxed m-0">
                                {comment.content}
                            </p>
                        </div>
                    </div>

                    {/* Dolna linia z subtle gradient */}
                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
                </CardContent>
            </AnimateStagger>
        </Card>
    );
}
