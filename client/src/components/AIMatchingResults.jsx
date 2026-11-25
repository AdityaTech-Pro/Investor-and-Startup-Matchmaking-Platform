import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AIMatchingResults = ({ matches, userRole, onClose, totalProfilesAnalyzed }) => {
  const navigate = useNavigate();
  const [profileCards, setProfileCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState('');
  const [processedMatches, setProcessedMatches] = useState('');

  if (!matches) return null;

  // Parse AI response to extract match information
  const parseMatches = useCallback((text) => {
    console.log('Parsing text length:', text.length);
    console.log('Text preview:', text.substring(0, 1000));

    const parsedMatches = [];
    let overallInsights = '';

    // Try multiple splitting strategies
    let matchSections = text.split(/(?=\*\*Match \d+:)/);

    // If no matches found with the first pattern, try alternative patterns
    if (matchSections.length <= 1) {
      matchSections = text.split(/(?=Match \d+:)/);
    }

    if (matchSections.length <= 1) {
      matchSections = text.split(/(?=\d+\.\s)/); // Try numbered list format
    }

    console.log('Found sections:', matchSections.length);

    matchSections.forEach((section, index) => {
      console.log(`Processing section ${index}:`, section.substring(0, 200));

      if (section.includes('**Match') || section.includes('Match ') || /^\d+\./.test(section.trim())) {
        // Try multiple name and score extraction patterns
        let nameMatch = section.match(/\*\*Match \d+: (.+?) - Score: (\d+)\/100/) ||
                       section.match(/\*\*Match \d+: (.+?) - (\d+)\/100/) ||
                       section.match(/Match \d+: (.+?) - Score: (\d+)\/100/) ||
                       section.match(/Match \d+: (.+?) - (\d+)\/100/) ||
                       section.match(/\d+\.\s*(.+?) - Score: (\d+)\/100/) ||
                       section.match(/\d+\.\s*(.+?) - (\d+)\/100/);

        // If still no match, try to extract name and score separately
        if (!nameMatch) {
          const nameOnly = section.match(/(?:\*\*Match \d+:|Match \d+:|\d+\.)\s*(.+?)(?:\n|- |$)/) ||
                          section.match(/(.+?)(?:\n|- |$)/);
          const scoreOnly = section.match(/Score:\s*(\d+)\/100/) ||
                           section.match(/(\d+)\/100/) ||
                           section.match(/(\d+)%/);

          if (nameOnly && scoreOnly) {
            nameMatch = [null, nameOnly[1].trim(), scoreOnly[1]];
          }
        }

        const organizationMatch = section.match(/(?:- )?\*\*Organization:\*\* (.+?)(?:\n|$)/) ||
                                 section.match(/Organization:\s*(.+?)(?:\n|$)/) ||
                                 section.match(/Company:\s*(.+?)(?:\n|$)/);

        const typeMatch = section.match(/(?:- )?\*\*(?:Investor Type|Industry|Type):\*\* (.+?)(?:\n|$)/) ||
                         section.match(/(?:Investor Type|Industry|Type):\s*(.+?)(?:\n|$)/);

        const recommendationMatch = section.match(/(?:- )?\*\*Recommendation:\*\* (.+?)(?:\n|$)/) ||
                                   section.match(/Recommendation:\s*(.+?)(?:\n|$)/);

        console.log('Name match:', nameMatch);
        console.log('Organization match:', organizationMatch);

        if (nameMatch && nameMatch[1] && nameMatch[2]) {
          const matchData = {
            name: nameMatch[1].trim(),
            score: parseInt(nameMatch[2]) || 0,
            organization: organizationMatch ? organizationMatch[1].trim() : '',
            type: typeMatch ? typeMatch[1].trim() : '',
            recommendation: recommendationMatch ? recommendationMatch[1].trim() : '',
            rawSection: section
          };

          console.log('Adding match:', matchData);
          parsedMatches.push(matchData);
        }
      } else if (section.includes('📈 OVERALL') || section.includes('📊 PORTFOLIO STRATEGY') ||
                section.includes('INSIGHTS') || section.includes('STRATEGY')) {
        overallInsights += section;
      }
    });

    console.log('Final parsed matches:', parsedMatches);
    return { matches: parsedMatches, insights: overallInsights };
  }, []);

  // Helper function to normalize strings for matching
  const normalizeString = (str) => {
    return str?.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim() || '';
  };

  // Helper function to check if two strings match (fuzzy matching)
  const isMatch = (str1, str2) => {
    const normalized1 = normalizeString(str1);
    const normalized2 = normalizeString(str2);

    // Exact match
    if (normalized1 === normalized2) return true;

    // Contains match
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return true;

    // Word-by-word match
    const words1 = normalized1.split(/\s+/);
    const words2 = normalized2.split(/\s+/);

    return words1.some(word1 =>
      words2.some(word2 =>
        word1.length > 2 && word2.length > 2 &&
        (word1.includes(word2) || word2.includes(word1))
      )
    );
  };

  // Fetch actual profile data from MongoDB
  const fetchProfileData = useCallback(async (matches) => {
    try {
      console.log('Fetching profile data for matches:', matches);
      
      const profilePromises = matches.map(async (match) => {
        try {
          let response;
          
          // Handle new structured format with investor objects
          if (match.investor && match.investor._id) {
            // This is already a structured match with investor data
            return {
              ...match,
              profileData: match.investor,
              profileType: 'investor',
              score: match.score || 0,
              reasoning: match.reasoning || '',
              alignmentPoints: match.alignmentPoints || [],
              concerns: match.concerns || [],
              recommendation: match.recommendation || 'Consider'
            };
          }
          
          // Handle legacy format with just name/type
          if (userRole === 'startup') {
            // Fetch investor profiles
            response = await axios.get('http://localhost:5000/api/forms/investor-form');
            const investor = response.data.find(inv => {
              // Try multiple matching strategies
              return isMatch(inv.fullName, match.name) ||
                     (inv.organization && isMatch(inv.organization, match.name)) ||
                     (match.organization && isMatch(inv.organization, match.organization));
            });
            return investor ? { ...match, profileData: investor, profileType: 'investor' } : match;
          } else {
            // Fetch startup profiles
            response = await axios.get('http://localhost:5000/api/forms/startup-form');
            const startup = response.data.find(start => {
              // Try multiple matching strategies
              return isMatch(start.startupName, match.name) ||
                     (start.founderNames && isMatch(start.founderNames, match.name)) ||
                     (match.organization && isMatch(start.startupName, match.organization));
            });
            return startup ? { ...match, profileData: startup, profileType: 'startup' } : match;
          }
        } catch (error) {
          console.error('Error fetching profile for:', match.name || match.investor?.fullName, error);
          return match;
        }
      });

      const profilesWithData = await Promise.all(profilePromises);
      return profilesWithData.filter(profile => profile.profileData); // Only return profiles with actual data
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }
  }, [userRole]);

  useEffect(() => {
    const loadProfiles = async () => {
      // Handle both array and string formats for matches
      if (!matches || (Array.isArray(matches) && matches.length === 0) || (typeof matches === 'string' && matches.trim() === '')) {
        console.log('No matches provided');
        setLoading(false);
        return;
      }

      // If matches is already an array (structured data), use it directly
      if (Array.isArray(matches)) {
        console.log('Using structured matches data:', matches);
        setLoading(true);
        
        const profilesWithData = await fetchProfileData(matches);
        console.log('Profiles with data:', profilesWithData);
        setProfileCards(profilesWithData);
        setInsights([]); // No insights for structured data
        setLoading(false);
        return;
      }

      // Prevent re-processing the same matches
      if (processedMatches === matches) {
        console.log('Matches already processed, skipping...');
        return;
      }

      setLoading(true);
      setProcessedMatches(matches);
      console.log('Processing matches - Full text:', matches);
      console.log('Processing matches - Preview:', matches.substring(0, 500) + '...');

      const { matches: parsedMatches, insights: extractedInsights } = parseMatches(matches);
      console.log('Parsed matches:', parsedMatches);
      console.log('Extracted insights:', extractedInsights);
      setInsights(extractedInsights);

      if (parsedMatches.length > 0) {
        const profilesWithData = await fetchProfileData(parsedMatches);
        console.log('Profiles with data:', profilesWithData);
        setProfileCards(profilesWithData);
      } else {
        console.log('No matches parsed from AI response');
        setProfileCards([]);
      }

      setLoading(false);
    };

    loadProfiles();
  }, [matches, userRole, parseMatches, fetchProfileData, processedMatches]);

  // Handle view profile navigation
  const handleViewProfile = (profile) => {
    console.log('Viewing profile:', profile);
    const { profileData, profileType } = profile;

    if (!profileData || !profileData._id) {
      console.error('Profile data or ID missing:', profile);
      alert('Unable to view profile. Profile data is incomplete.');
      return;
    }

    try {
      if (profileType === 'investor') {
        // Navigate to investor details page
        navigate(`/investordetails/${profileData._id}`);
      } else if (profileType === 'startup') {
        // Navigate to startup details page
        navigate(`/startupsdetails/${profileData._id}`);
      } else {
        console.error('Unknown profile type:', profileType);
        alert('Unable to view profile. Unknown profile type.');
        return;
      }

      // Close the AI matching results modal
      onClose();
    } catch (error) {
      console.error('Error navigating to profile:', error);
      alert('Unable to view profile. Please try again.');
    }
  };

  // Generate profile card component
  const ProfileCard = ({ profile }) => {
    const { profileData, score } = profile;

    // Get profile color based on score
    const getScoreColor = (score) => {
      if (score >= 80) return 'from-green-500 to-emerald-600';
      if (score >= 60) return 'from-yellow-500 to-orange-500';
      return 'from-red-500 to-pink-600';
    };

    // Get initials for avatar
    const getInitials = (name) => {
      return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    };

    const isInvestor = profile.profileType === 'investor';
    const name = isInvestor ? profileData.fullName : profileData.startupName;
    const organization = isInvestor ? profileData.organization : profileData.industry?.join(', ') || 'Startup';
    const type = isInvestor ? profileData.investorType : profileData.startupStage;

    return (
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105">
        {/* Score Header */}
        <div className={`bg-gradient-to-r ${getScoreColor(score)} p-4 text-white text-center relative`}>
          <div className="text-3xl font-bold mb-1">{getInitials(name)}</div>
          <div className="absolute top-2 right-2 bg-black/20 rounded-full px-2 py-1 text-sm font-semibold">
            {score}%
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-4">
          <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
          <p className="text-gray-400 text-sm mb-3">{organization}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {isInvestor ? (
              <>
                {profileData.preferredIndustries?.slice(0, 3).map((industry, idx) => (
                  <span key={idx} className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full text-xs">
                    {industry}
                  </span>
                ))}
                {type && (
                  <span className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded-full text-xs">
                    {type}
                  </span>
                )}
              </>
            ) : (
              <>
                {profileData.industry?.slice(0, 3).map((industry, idx) => (
                  <span key={idx} className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full text-xs">
                    {industry}
                  </span>
                ))}
                {type && (
                  <span className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded-full text-xs">
                    {type}
                  </span>
                )}
              </>
            )}
          </div>

          {/* View Profile Button */}
          <button
            onClick={() => handleViewProfile(profile)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg transition-all duration-200 font-semibold transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>View Profile</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl max-w-7xl w-full max-h-[90vh] overflow-hidden border border-purple-500/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                🤖 AI-Powered Matchmaking Results
              </h2>
              <p className="text-purple-100 mt-2">
                Analyzed {totalProfilesAnalyzed} {userRole === 'startup' ? 'investors' : 'startups'} to find your perfect matches
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition text-2xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <span className="ml-3 text-gray-300">Loading profile matches...</span>
            </div>
          ) : profileCards.length > 0 ? (
            <>
              {/* Profile Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {profileCards.map((profile, index) => (
                  <ProfileCard key={index} profile={profile} />
                ))}
              </div>

              {/* Insights Section */}
              {insights && (
                <div className="bg-gray-800/50 rounded-lg p-6 border border-purple-500/30">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    📈 AI Insights & Recommendations
                  </h3>
                  <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                    {insights}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg">No matching profiles found in the database.</div>
                <div className="text-gray-500 text-sm mt-2">Showing AI analysis in text format instead.</div>
              </div>

              {/* Fallback to original text format */}
              <div className="bg-gray-800/50 rounded-lg p-6 border border-purple-500/30">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  🤖 AI Matchmaking Analysis
                </h3>
                <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                  {matches}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-700 flex gap-4 justify-center">
            <button
              onClick={() => {
                navigator.clipboard.writeText(matches);
                alert('Results copied to clipboard!');
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
            >
              📋 Copy Results
            </button>
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMatchingResults;
