{
  lib,
  buildNpmPackage,
  ...
}:

buildNpmPackage rec {
  pname = "svatba-backend";
  version = "0.1.0";
  src = ./.;

  npmDepsHash = "sha256-pi+SNHwhLWJ4HMjBvXDNerqoP3NvEGIF9ZzSmKHnB64=";
}
