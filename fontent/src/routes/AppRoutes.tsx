import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { HomePage } from '../pages/Home/HomePage';
import { WorkPage } from '../pages/Work/WorkPage';
import { ProjectDetailPage } from '../pages/ProjectDetails/ProjectDetailPage';
import { AboutPage } from '../pages/About/AboutPage';
import { ServicesPage } from '../pages/Services/ServicesPage';
import { ContactPage } from '../pages/Contact/ContactPage';
import { AdminLoginPage } from '../pages/AdminLogin/AdminLoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminLayout } from '../layouts/AdminLayout';
import { AdminOverview } from '../pages/AdminDashboard/AdminOverview';
import { AdminProjects } from '../pages/AdminDashboard/AdminProjects';
import { AdminInquiries } from '../pages/AdminDashboard/AdminInquiries';
import { AdminMessages } from '../pages/AdminDashboard/AdminMessages';
import { AdminServices } from '../pages/AdminDashboard/AdminServices';
import { AdminTestimonials } from '../pages/AdminDashboard/AdminTestimonials';
import { AdminSettings } from '../pages/AdminDashboard/AdminSettings';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/work/:slug" element={<ProjectDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Portal */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
