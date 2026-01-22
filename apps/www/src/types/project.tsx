export type ProjectType = "chatbot" | "engineer" | "pd";

export interface ProjectMedia {
  id: number;
  media_url: string;
  media_type: "image" | "video";
  order_index: number;
}

export interface ProjectDetail {
  description: string;
  github_url: string | null;
  demo_url: string | null;
}

export interface Generation {
  name: string;
}

export interface Project {
  id: number;
  title: string;
  summary: string;
  project_type: ProjectType;
  thumbnail_url: string;
  generations: Generation[];
  project_details: ProjectDetail[];
  project_media: ProjectMedia[];
}

export const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  chatbot: "엔지니어·PD 합동 프로젝트",
  engineer: "엔지니어 파이널 프로젝트",
  pd: "PD 파이널 프로젝트",
};