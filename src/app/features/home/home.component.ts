import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

interface JobCategory {
  id: number;
  name: string;
  icon: string;
  count: string;
}

interface JobListing {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  logo: string;
  postedAt: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  categories: JobCategory[] = [
    { id: 1, name: 'Technology', icon: 'monitor', count: '1.2k+ jobs' },
    { id: 2, name: 'Design', icon: 'palette', count: '800+ jobs' },
    { id: 3, name: 'Marketing', icon: 'trending-up', count: '500+ jobs' },
    { id: 4, name: 'Finance', icon: 'dollar-sign', count: '300+ jobs' },
    { id: 5, name: 'Health', icon: 'activity', count: '400+ jobs' },
    { id: 6, name: 'Education', icon: 'graduation-cap', count: '200+ jobs' }
  ];

  featuredJobs: JobListing[] = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechFlow Solutions',
      location: 'Casablanca, Morocco',
      type: 'Full-time',
      salary: '$60k - $80k',
      logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TF',
      postedAt: '2h ago'
    },
    {
      id: 2,
      title: 'Product Designer',
      company: 'Creative Studio',
      location: 'Remote',
      type: 'Contract',
      salary: '$45k - $65k',
      logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CS',
      postedAt: '5h ago'
    },
    {
      id: 3,
      title: 'Backend Engineer (Node.js)',
      company: 'FastData systems',
      location: 'Rabat, Morocco',
      type: 'Full-time',
      salary: '$55k - $75k',
      logo: 'https://api.dicebear.com/7.x/initials/svg?seed=FD',
      postedAt: '1d ago'
    }
  ];

  ngOnInit(): void {
    console.log("Home component initialized");
  }
}



