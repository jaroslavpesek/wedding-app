{
  description = "svatba.maskova.wohlrath.cz";

  inputs = {
    nixpkgs = {
      url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    };
    flake-utils = {
      url = "github:numtide/flake-utils";
    };
  };

  outputs = { self, nixpkgs, flake-utils }:
  {
    nixosModules.default = import ./module.nix;
  } // flake-utils.lib.eachDefaultSystem (system:
  let pkgs = nixpkgs.legacyPackages."${system}";
  in {
    packages.backend = pkgs.callPackage ./backend {};
    packages.frontend = pkgs.callPackage ./frontend {};
  });
}
