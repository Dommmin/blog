import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { type Category } from '@/types/blog';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { useTranslations } from '@/hooks/useTranslation';

export default function Edit({ category }: { category: Category }) {
    const { __, locale } = useTranslations();
    const {
        data,
        setData,
        post: submitForm,
        processing,
        errors,
    } = useForm({
        name: category.name || '',
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitForm(route('admin.categories.update', category.id));
    };

    return (
        <AdminLayout>
            <Head title="Edit Category" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="mb-4">
                                <Link href={route('admin.categories.index')} prefetch>
                                    <Button variant="outline" size="sm" className="cursor-pointer">
                                        ← {__('Back to all Categories')}
                                    </Button>
                                </Link>
                            </div>
                            <CardTitle>Edit Category</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <Button type="submit" disabled={processing} className="w-full">
                                    Update Category
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
