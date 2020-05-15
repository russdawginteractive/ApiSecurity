// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using IdentityServer4.Models;
using System.Collections.Generic;

namespace ClientCred.IdServer
{
    public static class Config
    {
        public static IEnumerable<IdentityResource> Ids =>
            new IdentityResource[]
            {
                new IdentityResources.OpenId()
            };

        public static IEnumerable<ApiResource> Apis =>
            new ApiResource[] 
            { new ApiResource("auth.web.api")};

        public static IEnumerable<Client> Clients =>
            new Client[]
            {
                new Client{
                    ClientId = "ApiClient",
                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    ClientSecrets = new [] { new Secret("apisecret".Sha256())},
                    AllowedScopes = new []  { "auth.web.api" }
                }
            };
    }
}