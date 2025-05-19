import { GitHubIcon, LinkedInIcon } from '@/components/social-icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CodeIcon, DatabaseIcon, MailIcon, ServerIcon } from 'lucide-react';
import {useTranslations} from "@/hooks/useTranslation";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'About',
        href: '/about',
    },
];

export default function About() {
    const { __ } = useTranslations();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="About Me" />
            <div className="mx-auto max-w-5xl px-4 py-12">
                {/* Profile section */}
                <section className="mb-16">
                    <div className="grid items-start gap-8 md:grid-cols-[1fr_2fr]">
                        <div className="flex flex-col items-center gap-4 md:items-start">
                            <div className="border-primary/10 bg-muted h-48 w-48 overflow-hidden rounded-xl border-4">
                                <div className="from-primary/10 to-primary/5 flex h-full w-full items-center justify-center bg-gradient-to-br">
                                    <img src="/avatar.jpeg" alt="avatar" />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <a
                                    href="https://github.com/Dommmin"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <GitHubIcon className="h-5 w-5" />
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/dominik-jasi%C5%84ski/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <LinkedInIcon className="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                        <div>
                            <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Dominik Jasiński</h1>
                            <p className="text-muted-foreground mb-4 text-xl">PHP Developer & DevOps Engineer</p>
                            <div className="prose dark:prose-invert max-w-none">
                                <p>
                                    I'm a passionate PHP developer with extensive experience in Laravel and Symfony frameworks. With over 8 years of
                                    professional experience, I specialize in building robust, scalable web applications and implementing DevOps
                                    practices to streamline development workflows.
                                </p>
                                <p>
                                    My technical journey started with PHP, but quickly evolved to embrace modern development practices,
                                    containerization, CI/CD pipelines, and infrastructure as code. I believe in clean code, thorough testing, and
                                    continuous improvement.
                                </p>
                                <p>
                                    Through this blog, I share my experiences, best practices, and insights into PHP development and DevOps
                                    methodologies. Whether you're a beginner or an experienced developer, I hope you'll find valuable content that
                                    helps you in your own technical journey.
                                </p>
                            </div>
                            <div className="mt-6">
                                <Button asChild variant="outline" className="gap-2">
                                    <a href="mailto:domijas96@gmail.com">
                                        <MailIcon className="h-4 w-4" />
                                        {__('Contact Me')}
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Technical Skills section */}
                <section className="mb-16">
                    <h2 className="mb-6 text-2xl font-bold">{__('Technical Skills')}</h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="p-6">
                            <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                <CodeIcon className="text-primary h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Backend Development</h3>
                            <ul className="text-muted-foreground space-y-2">
                                <li>PHP (Laravel, Symfony)</li>
                                <li>API Design & Development</li>
                                <li>Performance Optimization</li>
                                <li>Testing (PHPUnit, Pest)</li>
                                <li>Design Patterns</li>
                            </ul>
                        </Card>
                        <Card className="p-6">
                            <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                <ServerIcon className="text-primary h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">DevOps</h3>
                            <ul className="text-muted-foreground space-y-2">
                                <li>Docker & Kubernetes</li>
                                <li>CI/CD (GitHub Actions, GitLab CI)</li>
                                <li>Infrastructure as Code (Terraform)</li>
                                <li>AWS, GCP, DigitalOcean</li>
                                <li>Linux Administration</li>
                            </ul>
                        </Card>
                        <Card className="p-6">
                            <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                <DatabaseIcon className="text-primary h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Database & Cache</h3>
                            <ul className="text-muted-foreground space-y-2">
                                <li>MySQL, PostgreSQL</li>
                                <li>MongoDB, DynamoDB</li>
                                <li>Redis</li>
                                <li>Database Optimization</li>
                                <li>Query Performance</li>
                            </ul>
                        </Card>
                    </div>
                </section>

                {/* Experience Timeline */}
                <section>
                    <h2 className="mb-6 text-2xl font-bold">{__('Professional Journey')}</h2>
                    <div className="border-primary/20 relative border-l pl-8">
                        {[
                            {
                                year: '2020 - Present',
                                role: 'PHP Developer & DevOps Engineer',
                                company: 'Ideo Sp. z o.o.',
                                description:
                                    'Leading backend development with Laravel and implementing DevOps practices to streamline development workflows.',
                            },
                        ].map((item, index) => (
                            <div key={index} className="relative mb-10">
                                <div className="border-primary bg-background absolute -left-10 mt-1.5 h-4 w-4 rounded-full border"></div>
                                <p className="text-muted-foreground text-sm">{item.year}</p>
                                <h3 className="text-xl font-semibold">{item.role}</h3>
                                <p className="text-muted-foreground mb-2">{item.company}</p>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
