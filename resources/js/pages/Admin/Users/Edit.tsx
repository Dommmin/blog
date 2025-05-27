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
                <h1 className="mb-6 text-2xl font-bold">Edit User</h1>

                <form onSubmit={submit} className="mb-4 rounded bg-white px-8 pt-6 pb-8 shadow-md">
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="name">
                            Name
                        </label>
                        <input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                            id="name"
                            type="text"
                            required
                        />
                        {errors.name && <div className="mt-1 text-xs text-red-500">{errors.name}</div>}
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="email">
                            Email
                        </label>
                        <input
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                            id="email"
                            type="email"
                            required
                        />
                        {errors.email && <div className="mt-1 text-xs text-red-500">{errors.email}</div>}
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="password">
                            Password (leave blank to keep current)
                        </label>
                        <input
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                            id="password"
                            type="password"
                        />
                        {errors.password && <div className="mt-1 text-xs text-red-500">{errors.password}</div>}
                    </div>

                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="role">
                            Role
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                            type="submit"
                            disabled={processing}
                        >
                            Update User
                        </button>
                        <Link
                            href={route('admin.users.index')}
                            className="inline-block align-baseline text-sm font-bold text-blue-500 hover:text-blue-800"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
