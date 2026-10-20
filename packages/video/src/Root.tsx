import { Composition } from 'remotion';
import { TagVaultDemo } from './TagVaultDemo';
import { fps, seconds } from './script';

export function Root() {
  return (
    <Composition
      id="TagVaultDemo"
      component={TagVaultDemo}
      durationInFrames={Math.round(seconds * fps)}
      fps={fps}
      width={1920}
      height={1080}
    />
  );
}
