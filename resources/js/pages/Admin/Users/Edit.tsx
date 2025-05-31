import InputError from '@/components/input-error';
import { useTranslations } from '@/hooks/useTranslation';
import { User } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import React from 'react';

interface Props {
    user: User;
}

type FormData = {
    name: string;
    email: string;
    password: string;
};

export default function Edit({ user }: Props) {
    const { __ } = useTranslations();

    const { data, setData, put, processing, errors } = useForm<FormData>({
        name: user.name,
        email: user.email,
        password: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-6 text-2xl font-bold">{__('Edit User')}</h1>

                <form onSubmit={submit} className="mb-4 rounded bg-white px-8 pt-6 pb-8 shadow-md">
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="name">
                            {__('Name')}
                        </label>
                        <input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                            id="name"
                            type="text"
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="email">
                            {__('Email')}
                        </label>
                        <input
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                            id="email"
                            type="email"
                            required
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="password">
                            {__('Password (leave blank to keep current)')}
                        </label>
                        <input
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                            id="password"
                            type="password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="role">
                            {__('Role')}
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                            type="submit"
                            disabled={processing}
                        >
                            {__('Update User')}
                        </button>
                        <Link
                            href={route('admin.users.index')}
                            className="inline-block align-baseline text-sm font-bold text-blue-500 hover:text-blue-800"
                        >
                            {__('Cancel')}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
