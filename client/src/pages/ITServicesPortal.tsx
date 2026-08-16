import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Send,
} from 'lucide-react';

export default function ITServicesPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Client Portal</h1>
          <div className="flex gap-4">
            <span className="text-slate-300">Welcome, Acme Corporation</span>
            <Button variant="outline" className="border-slate-600">Logout</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-sm">Active Projects</p>
                    <p className="text-3xl font-bold text-white">3</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-400" />
                </div>
              </Card>

              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-sm">Open Tickets</p>
                    <p className="text-3xl font-bold text-white">2</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-400" />
                </div>
              </Card>

              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-sm">Monthly Spend</p>
                    <p className="text-3xl font-bold text-white">$2,500</p>
                  </div>
                  <FileText className="h-8 w-8 text-green-400" />
                </div>
              </Card>

              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-sm">Uptime</p>
                    <p className="text-3xl font-bold text-white">99.9%</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-400" />
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex gap-4 pb-4 border-b border-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white font-semibold">Security Audit Completed</p>
                    <p className="text-slate-400 text-sm">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-4 pb-4 border-b border-slate-700">
                  <Clock className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white font-semibold">Monthly Report Generated</p>
                    <p className="text-slate-400 text-sm">1 day ago</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white font-semibold">Patch Management Completed</p>
                    <p className="text-slate-400 text-sm">3 days ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Active Projects</h3>
              <Button className="bg-blue-600 hover:bg-blue-700">New Project</Button>
            </div>

            {[
              { name: 'Cloud Migration', status: 'In Progress', progress: 65 },
              { name: 'Security Audit', status: 'Completed', progress: 100 },
              { name: 'AI Implementation', status: 'Planning', progress: 20 },
            ].map((project) => (
              <Card key={project.name} className="bg-slate-800 border-slate-700 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-white">{project.name}</h4>
                    <p className="text-slate-400 text-sm">{project.status}</p>
                  </div>
                  <span className="text-blue-400 font-semibold">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Support Tickets Tab */}
          <TabsContent value="tickets" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Support Tickets</h3>
              <Button className="bg-blue-600 hover:bg-blue-700">Create Ticket</Button>
            </div>

            {[
              { id: '#1001', title: 'VPN Connection Issue', status: 'Open', priority: 'High' },
              { id: '#1000', title: 'Software License Renewal', status: 'In Progress', priority: 'Medium' },
              { id: '#999', title: 'Password Reset Request', status: 'Resolved', priority: 'Low' },
            ].map((ticket) => (
              <Card key={ticket.id} className="bg-slate-800 border-slate-700 p-6 hover:border-blue-500 cursor-pointer transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex gap-3 items-center mb-2">
                      <span className="text-slate-400 font-mono">{ticket.id}</span>
                      <h4 className="text-white font-semibold">{ticket.title}</h4>
                    </div>
                    <div className="flex gap-4">
                      <span className={`text-sm px-2 py-1 rounded ${
                        ticket.status === 'Open' ? 'bg-red-900/30 text-red-300' :
                        ticket.status === 'In Progress' ? 'bg-yellow-900/30 text-yellow-300' :
                        'bg-green-900/30 text-green-300'
                      }`}>
                        {ticket.status}
                      </span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        ticket.priority === 'High' ? 'bg-red-900/30 text-red-300' :
                        ticket.priority === 'Medium' ? 'bg-yellow-900/30 text-yellow-300' :
                        'bg-blue-900/30 text-blue-300'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                  <MessageSquare className="h-5 w-5 text-slate-400" />
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-6">Reports & Documentation</h3>

            {[
              { name: 'Monthly Security Report - June 2026', date: 'June 30, 2026', size: '2.4 MB' },
              { name: 'Quarterly Compliance Audit', date: 'June 15, 2026', size: '3.1 MB' },
              { name: 'Infrastructure Assessment', date: 'June 1, 2026', size: '1.8 MB' },
              { name: 'Penetration Test Report', date: 'May 20, 2026', size: '4.2 MB' },
            ].map((report) => (
              <Card key={report.name} className="bg-slate-800 border-slate-700 p-6 flex justify-between items-center hover:border-blue-500 transition">
                <div>
                  <h4 className="text-white font-semibold">{report.name}</h4>
                  <p className="text-slate-400 text-sm">{report.date} • {report.size}</p>
                </div>
                <Button size="sm" variant="outline" className="border-slate-600 gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </Card>
            ))}
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-6">Invoices & Billing</h3>

            <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Current Balance</p>
                  <p className="text-2xl font-bold text-white">$0.00</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Next Invoice Due</p>
                  <p className="text-2xl font-bold text-white">July 1, 2026</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Monthly Service</p>
                  <p className="text-2xl font-bold text-white">$2,500.00</p>
                </div>
              </div>
            </Card>

            {[
              { id: 'INV-2026-006', amount: '$2,500.00', date: 'June 1, 2026', status: 'Paid' },
              { id: 'INV-2026-005', amount: '$2,500.00', date: 'May 1, 2026', status: 'Paid' },
              { id: 'INV-2026-004', amount: '$2,500.00', date: 'April 1, 2026', status: 'Paid' },
            ].map((invoice) => (
              <Card key={invoice.id} className="bg-slate-800 border-slate-700 p-6 flex justify-between items-center">
                <div>
                  <h4 className="text-white font-semibold">{invoice.id}</h4>
                  <p className="text-slate-400 text-sm">{invoice.date}</p>
                </div>
                <div className="flex gap-4 items-center">
                  <span className="text-white font-bold">{invoice.amount}</span>
                  <span className="bg-green-900/30 text-green-300 px-3 py-1 rounded text-sm">
                    {invoice.status}
                  </span>
                  <Button size="sm" variant="outline" className="border-slate-600">
                    View
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
