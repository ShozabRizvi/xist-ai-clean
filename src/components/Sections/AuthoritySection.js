import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheckIcon, BuildingOfficeIcon, DocumentTextIcon, StarIcon,
  TrophyIcon, GlobeAltIcon, UserGroupIcon, CheckCircleIcon,
  ExclamationTriangleIcon, InformationCircleIcon, LockClosedIcon,
  EyeIcon, ClipboardDocumentCheckIcon, CreditCardIcon, 
  BanknotesIcon, ScaleIcon, AcademicCapIcon, HandRaisedIcon,
  MegaphoneIcon, NewspaperIcon, CalendarIcon, ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

import { showNotification } from '../UI/NotificationToast';

const AuthoritySection = () => {
  const { user } = useAuth();
  
  // State management
  const [activeTab, setActiveTab] = useState('certifications');
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Certifications and Compliance Data
  const CERTIFICATIONS = [
    {
      id: 'iso-27001',
      name: 'ISO 27001:2013',
      category: 'Security Management',
      issuer: 'International Organization for Standardization',
      status: 'Certified',
      validUntil: '2025-12-31',
      description: 'Information Security Management System certification ensuring robust security controls and risk management.',
      logo: '🛡️',
      benefits: [
        'Systematic approach to managing sensitive information',
        'Regular security audits and assessments',
        'Continuous improvement of security processes',
        'International recognition and trust'
      ]
    },
    {
      id: 'soc2-type2',
      name: 'SOC 2 Type II',
      category: 'Data Protection',
      issuer: 'American Institute of CPAs',
      status: 'Certified',
      validUntil: '2025-10-15',
      description: 'Service Organization Control 2 certification validating our security, availability, and confidentiality controls.',
      logo: '🔐',
      benefits: [
        'Third-party validation of security controls',
        'Detailed audit of operational effectiveness',
        'Compliance with privacy regulations',
        'Enhanced customer trust and transparency'
      ]
    },
    {
      id: 'gdpr-compliant',
      name: 'GDPR Compliant',
      category: 'Privacy Regulation',
      issuer: 'European Union',
      status: 'Compliant',
      validUntil: 'Ongoing',
      description: 'Full compliance with General Data Protection Regulation for processing EU personal data.',
      logo: '🇪🇺',
      benefits: [
        'Lawful basis for data processing',
        'User rights protection and data portability',
        'Privacy by design implementation',
        'Regular data protection impact assessments'
      ]
    },
    {
      id: 'ccpa-compliant',
      name: 'CCPA Compliant',
      category: 'Privacy Regulation',
      issuer: 'State of California',
      status: 'Compliant',
      validUntil: 'Ongoing',
      description: 'California Consumer Privacy Act compliance ensuring user privacy rights protection.',
      logo: '🏛️',
      benefits: [
        'Consumer right to know about data collection',
        'Right to delete personal information',
        'Right to opt-out of data sales',
        'Non-discrimination for privacy requests'
      ]
    },
    {
      id: 'pci-dss',
      name: 'PCI DSS Level 1',
      category: 'Payment Security',
      issuer: 'PCI Security Standards Council',
      status: 'Certified',
      validUntil: '2025-09-30',
      description: 'Payment Card Industry Data Security Standard for secure payment processing.',
      logo: '💳',
      benefits: [
        'Secure payment card data handling',
        'Network security and access controls',
        'Regular vulnerability testing',
        'Comprehensive security policies'
      ]
    },
    {
      id: 'hipaa-compliant',
      name: 'HIPAA Compliant',
      category: 'Healthcare Privacy',
      issuer: 'U.S. Department of Health',
      status: 'Compliant',
      validUntil: 'Ongoing',
      description: 'Health Insurance Portability and Accountability Act compliance for healthcare data protection.',
      logo: '⚕️',
      benefits: [
        'Protected health information security',
        'Administrative, physical, and technical safeguards',
        'Business associate agreement compliance',
        'Breach notification procedures'
      ]
    }
  ];

  // Partnerships and Endorsements
  const PARTNERSHIPS = [
    {
      id: 'microsoft-partner',
      name: 'Microsoft Gold Partner',
      type: 'Technology Partnership',
      since: '2023',
      status: 'Active',
      description: 'Strategic partnership for cloud security solutions and Azure integration.',
      logo: '🔵',
      benefits: ['Azure cloud integration', 'Enterprise security tools', 'Technical support', 'Co-marketing opportunities']
    },
    {
      id: 'google-cloud',
      name: 'Google Cloud Partner',
      type: 'Cloud Partnership',
      since: '2023',
      status: 'Active',
      description: 'Certified partner for Google Cloud AI and security services.',
      logo: '🟡',
      benefits: ['AI/ML services', 'Cloud infrastructure', 'Security APIs', 'Developer resources']
    },
    {
      id: 'aws-partner',
      name: 'AWS Advanced Partner',
      type: 'Cloud Partnership',
      since: '2022',
      status: 'Active',
      description: 'Advanced tier partnership for AWS security and AI services.',
      logo: '🟠',
      benefits: ['Security services', 'AI/ML tools', 'Compliance frameworks', 'Global infrastructure']
    },
    {
      id: 'cybersecurity-alliance',
      name: 'Cybersecurity Alliance',
      type: 'Industry Association',
      since: '2023',
      status: 'Member',
      description: 'Active member of global cybersecurity standards and best practices alliance.',
      logo: '🛡️',
      benefits: ['Industry standards', 'Best practices', 'Threat intelligence', 'Research collaboration']
    }
  ];

  // Regulatory Bodies and Endorsements
  const ENDORSEMENTS = [
    {
      id: 'nist-framework',
      name: 'NIST Cybersecurity Framework',
      authority: 'National Institute of Standards and Technology',
      status: 'Aligned',
      description: 'Our security practices align with NIST cybersecurity framework guidelines.',
      logo: '🏛️'
    },
    {
      id: 'cisa-partnership',
      name: 'CISA Cybersecurity Partnership',
      authority: 'Cybersecurity and Infrastructure Security Agency',
      status: 'Partner',
      description: 'Collaborative partnership for national cybersecurity threat intelligence sharing.',
      logo: '🛡️'
    },
    {
      id: 'fbi-ic3',
      name: 'FBI IC3 Reporting Partner',
      authority: 'Federal Bureau of Investigation',
      status: 'Reporting Partner',
      description: 'Authorized partner for Internet Crime Complaint Center threat reporting.',
      logo: '🔍'
    },
    {
      id: 'academic-research',
      name: 'Academic Research Partnerships',
      authority: 'Leading Universities',
      status: 'Research Partner',
      description: 'Collaborative research with MIT, Stanford, and other institutions on AI safety.',
      logo: '🎓'
    }
  ];

  // Awards and Recognition
  const AWARDS = [
    {
      id: 'cybersecurity-excellence-2024',
      name: 'Cybersecurity Excellence Award 2024',
      category: 'Best AI Security Solution',
      issuer: 'Cybersecurity Excellence Awards',
      year: '2024',
      description: 'Recognized for innovative AI-powered threat detection and misinformation analysis.'
    },
    {
      id: 'tech-innovation-2024',
      name: 'Tech Innovation Award',
      category: 'AI Safety & Security',
      issuer: 'Tech Innovation Summit',
      year: '2024',
      description: 'Award for breakthrough technology in digital safety and threat prevention.'
    },
    {
      id: 'startup-50-2023',
      name: 'Top 50 Cybersecurity Startups',
      category: 'Emerging Technology',
      issuer: 'Cybersecurity Ventures',
      year: '2023',
      description: 'Listed among the most promising cybersecurity startups globally.'
    }
  ];

  // Audit Reports and Transparency
  const AUDIT_REPORTS = [
    {
      id: 'security-audit-2024q3',
      name: 'Q3 2024 Security Audit',
      type: 'Independent Security Assessment',
      date: '2024-09-15',
      auditor: 'CyberSec Auditing LLC',
      status: 'Passed',
      score: '98.5%',
      summary: 'Comprehensive security assessment covering infrastructure, applications, and processes.'
    },
    {
      id: 'privacy-audit-2024',
      name: '2024 Privacy Compliance Audit',
      type: 'Privacy and Data Protection',
      date: '2024-08-01',
      auditor: 'Privacy Compliance Partners',
      status: 'Compliant',
      score: '99.2%',
      summary: 'Full compliance assessment for GDPR, CCPA, and other privacy regulations.'
    },
    {
      id: 'ai-ethics-review-2024',
      name: 'AI Ethics Review 2024',
      type: 'AI Ethics and Bias Assessment',
      date: '2024-07-20',
      auditor: 'AI Ethics Institute',
      status: 'Approved',
      score: '97.8%',
      summary: 'Independent review of AI models for bias, fairness, and ethical considerations.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 py-8">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <div className="text-center">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <ShieldCheckIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Authority & Compliance
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              XIST AI maintains the highest standards of security, privacy, and regulatory compliance. 
              We're certified, audited, and endorsed by leading authorities worldwide.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { label: 'Security Certifications', value: '6+', icon: ShieldCheckIcon },
              { label: 'Compliance Standards', value: '12+', icon: DocumentTextIcon },
              { label: 'Industry Partners', value: '25+', icon: HandRaisedIcon },
              { label: 'Years Experience', value: '5+', icon: TrophyIcon }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="text-center"
              >
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2"
        >
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'certifications', label: 'Certifications', icon: ShieldCheckIcon },
              { id: 'partnerships', label: 'Partnerships', icon: HandRaisedIcon },
              { id: 'endorsements', label: 'Endorsements', icon: TrophyIcon },
              { id: 'audits', label: 'Audit Reports', icon: ClipboardDocumentCheckIcon },
              { id: 'awards', label: 'Awards', icon: StarIcon }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <motion.div
              key="certifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Security & Compliance Certifications
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CERTIFICATIONS.map((cert, index) => (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => setSelectedCertificate(cert)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-3xl">{cert.logo}</div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          cert.status === 'Certified' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        }`}>
                          {cert.status}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {cert.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {cert.category}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        {cert.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Valid until: {cert.validUntil}
                        </span>
                        <ArrowRightIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Partnerships Tab */}
          {activeTab === 'partnerships' && (
            <motion.div
              key="partnerships"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Strategic Partnerships
                </h2>
                
                <div className="space-y-6">
                  {PARTNERSHIPS.map((partner, index) => (
                    <motion.div
                      key={partner.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-6 p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all"
                    >
                      <div className="text-4xl flex-shrink-0">{partner.logo}</div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {partner.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              {partner.type} • Since {partner.since}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            partner.status === 'Active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                            {partner.status}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          {partner.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {partner.benefits.map((benefit, benefitIndex) => (
                            <span
                              key={benefitIndex}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Endorsements Tab */}
          {activeTab === 'endorsements' && (
            <motion.div
              key="endorsements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Regulatory Endorsements & Recognition
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ENDORSEMENTS.map((endorsement, index) => (
                    <motion.div
                      key={endorsement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl flex-shrink-0">{endorsement.logo}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {endorsement.name}
                            </h3>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              endorsement.status === 'Aligned' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                              endorsement.status === 'Partner' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                              'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                            }`}>
                              {endorsement.status}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {endorsement.authority}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            {endorsement.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Audit Reports Tab */}
          {activeTab === 'audits' && (
            <motion.div
              key="audits"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Independent Audit Reports
                </h2>
                
                <div className="space-y-6">
                  {AUDIT_REPORTS.map((audit, index) => (
                    <motion.div
                      key={audit.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {audit.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <span>{audit.type}</span>
                            <span>•</span>
                            <span>{audit.date}</span>
                            <span>•</span>
                            <span>{audit.auditor}</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">
                            {audit.summary}
                          </p>
                        </div>
                        
                        <div className="text-right ml-6">
                          <div className={`px-4 py-2 rounded-lg text-sm font-medium mb-2 ${
                            audit.status === 'Passed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                            audit.status === 'Compliant' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                            'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                          }`}>
                            {audit.status}
                          </div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {audit.score}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Transparency Statement */}
                <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center space-x-2">
                    <InformationCircleIcon className="w-5 h-5" />
                    <span>Transparency Commitment</span>
                  </h3>
                  <p className="text-blue-800 dark:text-blue-300 text-sm">
                    We believe in complete transparency. All our audit reports, compliance certificates, 
                    and security assessments are conducted by independent third-party organizations and 
                    are available for review by our enterprise customers and partners.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Awards Tab */}
          {activeTab === 'awards' && (
            <motion.div
              key="awards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Awards & Recognition
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {AWARDS.map((award, index) => (
                    <motion.div
                      key={award.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrophyIcon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="mb-2">
                        <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                          {award.year}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {award.name}
                        </h3>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {award.category}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-500">
                          {award.issuer}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {award.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Certificate Detail Modal */}
        <AnimatePresence>
          {selectedCertificate && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCertificate(null)}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{selectedCertificate.logo}</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedCertificate.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedCertificate.issuer}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCertificate(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedCertificate.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Key Benefits</h3>
                    <ul className="space-y-2">
                      {selectedCertificate.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
                      <div className={`font-medium ${
                        selectedCertificate.status === 'Certified' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-blue-600 dark:text-blue-400'
                      }`}>
                        {selectedCertificate.status}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Valid Until</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {selectedCertificate.validUntil}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default AuthoritySection;
