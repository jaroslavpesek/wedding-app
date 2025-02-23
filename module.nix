{ config, pkgs, lib, ... }:

with lib;
let cfg = config.services.svatba;
in {
  options.services.svatba = {
    enable = mkEnableOption "Svatebni stranky";
    backendHost = mkOption {
      type = types.str;
    };
    backendPort = mkOption {
      type = types.port;
      default = 2020;
    };
    frontendHost = mkOption {
      type = types.str;
    };
    mongoUri = mkOption {
      type = types.str;
    };
  };

  config = mkIf cfg.enable {
    services.nginx.virtualHosts."${cfg.backendHost}" = {
      forceSSL = true;
      enableACME = true;
      serverAliases = [ "www.${cfg.backendHost}" ];
      locations."/" = {
        proxyPass = "http://127.0.0.1:${toString cfg.backendPort}";
        extraConfig = ''
          proxy_set_header  X-Script-Name /;
          proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_pass_header Authorization;
        '';
      };
    };
    services.nginx.virtualHosts."${cfg.frontendHost}" = {
      forceSSL = true;
      enableACME = true;
      serverAliases = [ "www.${cfg.frontendHost}" ];
      locations."/" = {
        root = pkgs.callPackage ./frontend {};
      };
    };
    systemd.services."backend-${cfg.backendHost}" = {
      enable = true;
      serviceConfig = {
        ExecStart = let backend = pkgs.callPackage ./backend {};
          in "${backend}/bin/server";
        #Restart="always";
      };
    };
  };
}
