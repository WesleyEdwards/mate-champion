import { devSettings } from "../Game/devSettings";
import { CourseBuilderSettings } from "../Game/devTools/CourseBuilderSettings";

export const LevelCreator = () => {
  return <>{devSettings.courseBuilder && <CourseBuilderSettings />}</>;
};
