{
  lib,
  buildNpmPackage,
  ...
}:
  
buildNpmPackage rec {
  pname = "svatba-frontend";
  version = "0.1.0";
  src = ./.;

  npmDepsHash = "sha256-GJVZwygSwWztjHFfbz/Qulj+eCXg7vgSuqe9xYzPvsg=";
  installPhase = ''
    mkdir -p $out
    cp -a dist/. $out
  '';
}
