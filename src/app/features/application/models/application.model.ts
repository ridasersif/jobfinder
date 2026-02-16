export interface Application {
  id?: string;
  userId: string;
  JobSlug: string;
  title: string;
  company: string;
  location: string;
  status: 'pending' | 'accepted' | 'rejected';
  dateAdded: string;
   statusUpdated?: string | null;
}



