'use client';

import { FileText, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { StateGuide, RecordedIncident } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/utils';

interface InformationCardProps {
  variant: 'guide' | 'incidentSummary';
  data: StateGuide | RecordedIncident;
  onClick?: () => void;
}

export function InformationCard({ variant, data, onClick }: InformationCardProps) {
  if (variant === 'guide') {
    const guide = data as StateGuide;
    return (
      <div className="guide-card" onClick={onClick}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">{guide.stateName} Guide</h3>
              <p className="text-sm text-text-secondary">
                {guide.language === 'en' ? 'English' : 'Español'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-purple-400">
              {formatCurrency(guide.price)}
            </p>
            <p className="text-xs text-text-secondary">one-time</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">What You'll Learn:</h4>
            <ul className="space-y-1">
              <li className="text-sm text-text-secondary flex items-center">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2" />
                Your constitutional rights during stops
              </li>
              <li className="text-sm text-text-secondary flex items-center">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2" />
                What to say and what NOT to say
              </li>
              <li className="text-sm text-text-secondary flex items-center">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2" />
                Recording your interactions legally
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const incident = data as RecordedIncident;
  return (
    <div className="metric-card" onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-red-500/20 p-2 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Incident Report</h3>
            <p className="text-sm text-text-secondary">
              {formatDate(incident.timestamp)}
            </p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          incident.alertSent 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-yellow-500/20 text-yellow-400'
        }`}>
          {incident.alertSent ? 'Alert Sent' : 'No Alert'}
        </div>
      </div>

      <div className="space-y-2">
        {incident.location.address && (
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <MapPin className="h-4 w-4" />
            <span>{incident.location.address}</span>
          </div>
        )}
        
        {incident.duration && (
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Clock className="h-4 w-4" />
            <span>{Math.floor(incident.duration / 60)}m {incident.duration % 60}s</span>
          </div>
        )}

        {incident.notes && (
          <p className="text-sm text-text-secondary mt-2 line-clamp-2">
            {incident.notes}
          </p>
        )}
      </div>
    </div>
  );
}
