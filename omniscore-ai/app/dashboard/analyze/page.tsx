"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FileDropzone from "@/components/ui/FileDropzone";
import {
  Brain,
  FileText,
  Briefcase,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";

interface JobDescription {
  id: string;
  title: string;
  company: string;
  extractedSkills: string[];
}

export default function AnalyzePage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [useTextInput, setUseTextInput] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [customJobText, setCustomJobText] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [jobOptions, setJobOptions] = useState<JobDescription[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Loading animation step states
  const [step, setStep] = useState(0);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/job-descriptions");
        if (res.ok) {
          const data = await res.json();
          setJobOptions(data);
        }
      } catch (err) {
        console.error("Failed to fetch job descriptions:", err);
      } finally {
        setIsLoadingJobs(false);
      }
    }
    fetchJobs();
  }, []);

  const handleAnalyze = async () => {
    if (!selectedFile && !resumeText.trim()) {
      setError("Please upload a CV file or paste resume text.");
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setStep(1);

    // Simulate progress animation steps
    const timer1 = setTimeout(() => setStep(2), 1200);
    const timer2 = setTimeout(() => setStep(3), 2500);

    try {
      const formData = new FormData();
      if (selectedFile && !useTextInput) {
        formData.append("file", selectedFile);
      } else {
        formData.append("resumeText", resumeText);
      }

      if (selectedJobId) {
        formData.append("jobDescriptionId", selectedJobId);
      } else if (customJobText.trim()) {
        formData.append("jobDescriptionText", customJobText);
      }

      if (githubUsername.trim()) {
        formData.append("githubUsername", githubUsername.trim());
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Analysis failed");
      }

      const data = await res.json();
      router.push(`/dashboard/scorecard/${data.id}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during analysis";
      setError(errorMessage);
      setIsAnalyzing(false);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Start Profile <span className="text-emerald-400">Analysis</span>
        </h1>
        <p className="text-slate-400">
          Upload your resume and optionally select a target job or connect your GitHub profile.
        </p>
      </div>

      {error && (
        <div className="bg-crimson-500/10 border border-crimson-500/30 rounded-xl p-4 flex items-center gap-3 text-crimson-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: CV Upload */}
      <div className="glass-card-static p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            1. Upload Resume
          </h2>
          <button
            onClick={() => setUseTextInput(!useTextInput)}
            className="text-xs text-slate-400 hover:text-emerald-400 underline transition-colors"
          >
            {useTextInput ? "Switch to file upload" : "Paste text instead"}
          </button>
        </div>

        {!useTextInput ? (
          <FileDropzone
            onFileSelect={setSelectedFile}
            selectedFile={selectedFile}
          />
        ) : (
          <div>
            <textarea
              rows={8}
              placeholder="Paste raw resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="input-field font-mono text-xs leading-relaxed"
            />
          </div>
        )}
      </div>

      {/* Step 2: Target Job Description */}
      <div className="glass-card-static p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-cyan-400" />
          2. Target Job Description (Recommended)
        </h2>
        <p className="text-xs text-slate-400">
          Select a sample role or paste a job description to get vector-based skill gap matching.
        </p>

        {isLoadingJobs ? (
          <div className="h-10 skeleton" />
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {jobOptions.map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => {
                  setSelectedJobId(selectedJobId === job.id ? "" : job.id);
                  setCustomJobText("");
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedJobId === job.id
                    ? "border-cyan-400 bg-cyan-500/10"
                    : "border-glass-border bg-navy-700/30 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-white">{job.title}</span>
                  {selectedJobId === job.id && (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-2">{job.company}</p>
                <div className="flex flex-wrap gap-1">
                  {job.extractedSkills.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-full bg-navy-800 text-[10px] text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                  {job.extractedSkills.length > 4 && (
                    <span className="text-[10px] text-slate-500">
                      +{job.extractedSkills.length - 4} more
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="pt-2">
          <label className="text-xs font-medium text-slate-400 mb-1 block">
            Or paste a custom Job Description:
          </label>
          <textarea
            rows={4}
            placeholder="Paste job description requirements..."
            value={customJobText}
            onChange={(e) => {
              setCustomJobText(e.target.value);
              setSelectedJobId("");
            }}
            className="input-field text-xs"
          />
        </div>
      </div>

      {/* Step 3: GitHub Integration */}
      <div className="glass-card-static p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <GithubIcon className="w-5 h-5 text-purple-400" />
          3. GitHub Integration (Optional)
        </h2>
        <p className="text-xs text-slate-400">
          Enter your GitHub username to enable commit activity, repo complexity, and proof-of-work scoring.
        </p>

        <div>
          <input
            type="text"
            placeholder="e.g. octocat or github.com/octocat"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            className="input-field max-w-md"
          />
        </div>
      </div>

      {/* Submit Action */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="btn-primary text-base py-3.5 px-8 flex items-center gap-2 min-w-[200px] justify-center"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>
                {step === 1 && "Parsing Resume..."}
                {step === 2 && "Vectorizing Skills..."}
                {step === 3 && "Calculating Score..."}
              </span>
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              Run OmniScore Analysis
            </>
          )}
        </button>
      </div>
    </div>
  );
}
