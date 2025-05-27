import { AnimateOnView, AnimateStagger } from '@/components/AnimateOnView';
import { GitHubIcon, LinkedInIcon } from '@/components/social-icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslations } from '@/hooks/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { CodeIcon, DatabaseIcon, MailIcon, ServerIcon } from 'lucide-react';

export default function About() {
    const { __ } = useTranslations();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('About me'),
            href: '/about',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-5xl px-4 py-12">
                <section className="mb-16">
                    <div className="grid items-start gap-8 md:grid-cols-[1fr_2fr]">
                        <AnimateStagger animation="fade-right" stagger={100}>
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
                            <div
                                className="badge-base LI-profile-badge"
                                data-locale="pl_PL"
                                data-size="medium"
                                data-theme="dark"
                                data-type="VERTICAL"
                                data-vanity="dominik-jasiński"
                                data-version="v1"
                            >
                                <a
                                    className="badge-base__link LI-simple-link"
                                    href="https://pl.linkedin.com/in/dominik-jasi%C5%84ski?trk=profile-badge"
                                >
                                    Dominik Jasiński
                                </a>
                            </div>
                        </AnimateStagger>
                        <AnimateStagger animation="fade-left" stagger={100}>
                            <div>
                                <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Dominik Jasiński</h1>
                                <p className="text-muted-foreground mb-4 text-xl">{__('PHP Developer & DevOps Engineer')}</p>
                                <div className="prose dark:prose-invert max-w-none">
                                    <p>
                                        {__(
                                            "I'm a passionate PHP developer with 3 years of professional experience in Laravel and Symfony frameworks. I specialize in building robust web applications and implementing DevOps practices. I also have extensive experience in modern JavaScript development, working with React and Vue.js to create responsive and interactive user interfaces.",
                                        )}
                                    </p>
                                    <p>
                                        {__(
                                            'My technical journey started with PHP, but quickly evolved to embrace modern development practices, containerization, CI/CD pipelines, and frontend technologies. I believe in clean code, thorough testing, and continuous improvement. My full-stack approach allows me to build complete solutions from database to user interface.',
                                        )}
                                    </p>
                                    <p>
                                        {__(
                                            "Through this blog, I share my experiences, best practices, and insights into PHP development, JavaScript frameworks, and DevOps methodologies. Whether you're a beginner or an experienced developer, I hope you'll find valuable content that helps you in your own technical journey.",
                                        )}
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
                        </AnimateStagger>
                    </div>
                </section>

                <section className="mb-16">
                    <h2 className="mb-6 text-2xl font-bold">{__('Technical Skills')}</h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        <AnimateStagger animation="fade-up" stagger={100}>
                            <Card className="p-6">
                                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                    <CodeIcon className="text-primary h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">{__('Fullstack Development')}</h3>
                                <ul className="text-muted-foreground space-y-2">
                                    <li>{__('PHP (Laravel, Symfony)')}</li>
                                    <li>{__('Javascript (React, Vue)')}</li>
                                    <li>{__('API Design & Development')}</li>
                                    <li>{__('Performance Optimization')}</li>
                                    <li>{__('Testing (PHPUnit, Pest)')}</li>
                                    <li>{__('Design Patterns')}</li>
                                </ul>
                            </Card>
                        </AnimateStagger>
                        <AnimateStagger animation="fade-up" stagger={100}>
                            <Card className="p-6">
                                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                    <ServerIcon className="text-primary h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">{__('DevOps')}</h3>
                                <ul className="text-muted-foreground space-y-2">
                                    <li>{__('Docker, Linux')}</li>
                                    <li>{__('Continuous Integration & Deployment')}</li>
                                    <li>{__('(GitHub Actions, GitLab CI)')}</li>
                                </ul>
                            </Card>
                        </AnimateStagger>
                        <AnimateStagger animation="fade-up" stagger={100}>
                            <Card className="p-6">
                                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                    <DatabaseIcon className="text-primary h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">{__('Database & Cache')}</h3>
                                <ul className="text-muted-foreground space-y-2">
                                    <li>{__('MySQL, PostgreSQL')}</li>
                                    <li>{__('Redis')}</li>
                                    <li>{__('Database Optimization')}</li>
                                    <li>{__('Query Performance')}</li>
                                </ul>
                            </Card>
                        </AnimateStagger>
                    </div>
                </section>

                <AnimateOnView animation="fade-up" duration="duration-700" delay="delay-200">
                    <section>
                        <h2 className="mb-6 text-2xl font-bold">{__('Professional Journey')}</h2>
                        <div className="border-primary/20 relative border-l pl-8">
                            {[
                                {
                                    year: __('2022 - Present'),
                                    role: __('PHP Developer & DevOps Engineer'),
                                    company: __('Ideo Sp. z o.o.'),
                                    description: __(
                                        'Responsible for developing and maintaining web applications using Laravel and React. Implementing DevOps practices including Docker containerization, CI/CD pipelines, and automated testing. Leading technical decisions and mentoring junior developers. Optimizing application performance and ensuring code quality through code reviews and best practices.',
                                    ),
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
                </AnimateOnView>
            </div>
        </AppLayout>
    );
}
