import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/useTranslation';
import AdminLayout from '@/layouts/admin-layout';
import { Tag } from '@/types/blog';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

export default function Edit({ tag }: { tag: Tag }) {
    const { locale } = useTranslations();

    const {
        data,
        setData,
        post: submitForm,
        processing,
        errors,
    } = useForm({
        name: tag.name || '',
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitForm(route('admin.tags.update', tag.id));
    };

    return (
        <AdminLayout>
            <Head title="Edit Tag" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="mb-4">
                                <Link href={route('admin.tags.index', { locale })} prefetch>
                                    <Button variant="outline" size="sm">
                                        ← Back to all Tags
                                    </Button>
                                </Link>
                            </div>
                            <CardTitle>Edit Tag</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <Button type="submit" disabled={processing} className="w-full">
                                    Update Tag
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
