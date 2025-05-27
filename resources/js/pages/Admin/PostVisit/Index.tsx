import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslations } from '@/hooks/useTranslation';
import AdminLayout from '@/layouts/admin-layout';
import { Visit } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface VisitsPageProps {
  visits: {
      data: Visit[];
      current_page: number;
      last_page: number;
      prev_page_url: string | null;
      next_page_url: string | null;
  };
}

export default function Index({ visits }: VisitsPageProps) {
  const { __, locale } = useTranslations();

  return (
      <AdminLayout>
          <Head title={__('Manage Posts')} />

          <div className="py-12">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="bg-background dark:border-border overflow-hidden rounded-lg shadow-sm dark:border">
                      <div className="dark:border-border border-b p-6">
                          <div className="mb-6 flex items-center justify-between">
                              <h3 className="text-lg font-medium">{__('Post Visits')}</h3>
                          </div>
                          {visits.data.length > 0 ? (
                              <Table>
                                  <TableHeader>
                                      <TableRow>
                                          <TableHead>{__('Post')}</TableHead>
                                          <TableHead>{__('User')}</TableHead>
                                          <TableHead>{__('IP Address')}</TableHead>
                                      </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                      {visits.data.map((visit) => (
                                          <TableRow key={visit.id}>
                                              <TableCell>{visit.post.title}</TableCell>
                                              <TableCell>{visit.user?.email}</TableCell>
                                              <TableCell>{visit.ip_address}</TableCell>
                                          </TableRow>
                                      ))}
                                  </TableBody>
                              </Table>
                          ) : (
                              <div className="p-6 text-center">
                                  <h3 className="text-lg font-medium">{__('No visits found')}</h3>
                              </div>
                          )}

                          {/* Pagination */}
                          {(visits.prev_page_url || visits.next_page_url) && (
                              <div className="mt-6">
                                  <Pagination className="justify-between">
                                      {visits.prev_page_url ? (
                                          <Button variant="outline" asChild>
                                              <Link href={visits.prev_page_url} prefetch>
                                                  {__('Previous')}
                                              </Link>
                                          </Button>
                                      ) : (
                                          <Button variant="outline" disabled>
                                              {__('Previous')}
                                          </Button>
                                      )}

                                      <div className="text-muted-foreground text-sm">
                                          {__('Page')} {visits.current_page} {__('of')} {visits.last_page}
                                      </div>

                                      {visits.next_page_url ? (
                                          <Button variant="outline" asChild>
                                              <Link href={visits.next_page_url} prefetch>
                                                  {__('Next')}
                                              </Link>
                                          </Button>
                                      ) : (
                                          <Button variant="outline" disabled>
                                              {__('Next')}
                                          </Button>
                                      )}
                                  </Pagination>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      </AdminLayout>
  );
}
