import React from "react";
import { PinContainer } from "@/components/ui/3d-pin";
import { Activity, Brain, FileText, Shield, Users, Zap, Clock, TrendingUp } from "lucide-react";

export function AdvancedFeatureCards() {
  return (
    <div className="w-full py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Advanced Healthcare Features
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Powerful tools designed for modern nursing professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* AI-Powered Documentation */}
          <PinContainer
            title="AI Documentation"
            href="#"
            containerClassName="h-[400px]"
          >
            <div className="flex flex-col p-6 tracking-tight text-slate-100/50 w-[20rem] h-[20rem] bg-gradient-to-b from-teal-900/50 to-teal-900/0 backdrop-blur-sm border border-teal-700/50 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="size-3 rounded-full bg-teal-500 animate-pulse" />
                <div className="text-xs text-teal-400">AI Active</div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-500/20 rounded-lg">
                    <Brain className="h-6 w-6 text-teal-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-100">
                    AI Documentation
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-teal-400">99.2%</div>
                    <div className="text-xs text-slate-400">Accuracy</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-emerald-400">15min</div>
                    <div className="text-xs text-slate-400">Time Saved</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-slate-300">Real-time transcription</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-slate-300">HIPAA compliant</span>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-4">
                  <div className="text-xs text-slate-400">
                    Last updated: now
                  </div>
                  <div className="text-teal-400 text-sm font-medium">
                    Learn More →
                  </div>
                </div>
              </div>
            </div>
          </PinContainer>

          {/* Epic Integration */}
          <PinContainer
            title="Epic Integration"
            href="#"
            containerClassName="h-[400px]"
          >
            <div className="flex flex-col p-6 tracking-tight text-slate-100/50 w-[20rem] h-[20rem] bg-gradient-to-b from-blue-900/50 to-blue-900/0 backdrop-blur-sm border border-blue-700/50 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="size-3 rounded-full bg-blue-500 animate-pulse" />
                <div className="text-xs text-blue-400">Connected</div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-100">
                    Epic EMR
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-blue-400">9</div>
                    <div className="text-xs text-slate-400">Templates</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-emerald-400">100%</div>
                    <div className="text-xs text-slate-400">Compliant</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-slate-300">Shift assessments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-slate-300">MAR documentation</span>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-4">
                  <div className="text-xs text-slate-400">
                    9 templates ready
                  </div>
                  <div className="text-blue-400 text-sm font-medium">
                    Explore →
                  </div>
                </div>
              </div>
            </div>
          </PinContainer>

          {/* Team Collaboration */}
          <PinContainer
            title="Team Collaboration"
            href="#"
            containerClassName="h-[400px]"
          >
            <div className="flex flex-col p-6 tracking-tight text-slate-100/50 w-[20rem] h-[20rem] bg-gradient-to-b from-purple-900/50 to-purple-900/0 backdrop-blur-sm border border-purple-700/50 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="size-3 rounded-full bg-purple-500 animate-pulse" />
                <div className="text-xs text-purple-400">Team Online</div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Users className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-100">
                    Collaboration
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-purple-400">24</div>
                    <div className="text-xs text-slate-400">Team Members</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-emerald-400">127</div>
                    <div className="text-xs text-slate-400">Shared Notes</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm text-slate-300">Real-time sharing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-slate-300">Secure handoffs</span>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-4">
                  <div className="text-xs text-slate-400">
                    5 online now
                  </div>
                  <div className="text-purple-400 text-sm font-medium">
                    Join Team →
                  </div>
                </div>
              </div>
            </div>
          </PinContainer>

          {/* Analytics Dashboard */}
          <PinContainer
            title="Analytics"
            href="#"
            containerClassName="h-[400px]"
          >
            <div className="flex flex-col p-6 tracking-tight text-slate-100/50 w-[20rem] h-[20rem] bg-gradient-to-b from-orange-900/50 to-orange-900/0 backdrop-blur-sm border border-orange-700/50 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="size-3 rounded-full bg-orange-500 animate-pulse" />
                <div className="text-xs text-orange-400">Live Data</div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-100">
                    Analytics
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-orange-400">427</div>
                    <div className="text-xs text-slate-400">Notes Created</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-emerald-400">45h</div>
                    <div className="text-xs text-slate-400">Time Saved</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-slate-300">Performance tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-slate-300">Quality metrics</span>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-4">
                  <div className="text-xs text-slate-400">
                    Updated 1 min ago
                  </div>
                  <div className="text-orange-400 text-sm font-medium">
                    View Stats →
                  </div>
                </div>
              </div>
            </div>
          </PinContainer>

          {/* Voice Recognition */}
          <PinContainer
            title="Voice Recognition"
            href="#"
            containerClassName="h-[400px]"
          >
            <div className="flex flex-col p-6 tracking-tight text-slate-100/50 w-[20rem] h-[20rem] bg-gradient-to-b from-pink-900/50 to-pink-900/0 backdrop-blur-sm border border-pink-700/50 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="size-3 rounded-full bg-pink-500 animate-pulse" />
                <div className="text-xs text-pink-400">Listening</div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Activity className="h-6 w-6 text-pink-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-100">
                    Voice AI
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-pink-400">98%</div>
                    <div className="text-xs text-slate-400">Accuracy</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-emerald-400">6x</div>
                    <div className="text-xs text-slate-400">Faster</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-slate-300">Real-time transcription</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-slate-300">Medical terminology</span>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-4">
                  <div className="text-xs text-slate-400">
                    Ready to record
                  </div>
                  <div className="text-pink-400 text-sm font-medium">
                    Start →
                  </div>
                </div>
              </div>
            </div>
          </PinContainer>

          {/* Time Savings */}
          <PinContainer
            title="Time Savings"
            href="#"
            containerClassName="h-[400px]"
          >
            <div className="flex flex-col p-6 tracking-tight text-slate-100/50 w-[20rem] h-[20rem] bg-gradient-to-b from-cyan-900/50 to-cyan-900/0 backdrop-blur-sm border border-cyan-700/50 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="size-3 rounded-full bg-cyan-500 animate-pulse" />
                <div className="text-xs text-cyan-400">Tracking</div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Clock className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-100">
                    Time Saved
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-cyan-400">15min</div>
                    <div className="text-xs text-slate-400">Per Note</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-emerald-400">45h</div>
                    <div className="text-xs text-slate-400">This Month</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-slate-300">Instant generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-slate-300">Productivity boost</span>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-4">
                  <div className="text-xs text-slate-400">
                    427 notes saved
                  </div>
                  <div className="text-cyan-400 text-sm font-medium">
                    Details →
                  </div>
                </div>
              </div>
            </div>
          </PinContainer>
        </div>
      </div>
    </div>
  );
}
