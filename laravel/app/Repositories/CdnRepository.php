<?php

namespace App\Repositories;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Http;

use Illuminate\Support\Facades\Notification;

use App\Jobs\Bunny\UpdateZoneRule;

class CdnRepository extends AbstractRepository
{
    private $apiBunnyCdn;

    private $apiDigitalocean;

    public $cdn_key = 'LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tDQpNSUlFdmdJQkFEQU5CZ2txaGtpRzl3MEJBUUVGQUFTQ0JLZ3dnZ1NrQWdFQUFvSUJBUUMrc0xXV1l3bEwzemRVDQpZVnV2OTBzSlVPQ3IxZU9TbFRLbzNaUnBxcHkwb3E0RDgxUUtSOWlWUmVIV0t5R0FVV2pCbndsTXdsOU84aUJYDQo3Q2dsRmNFVmdqZUpFV3lFanptZk5MMkZwdnU5RFpaVzBNc09xQVB1clFqd0hhcmZ2Mko5WUszODRkRXUrbXBQDQppazhRSGd0UkJrSnBaOGY4djBRc0REcmVyM2h4TE5VbTdWMC9MZGc2V0hDcUJJaW1zRG1SNUZkbG5GeXZ5M0FHDQpuZ0FpMXh2YStjTGtDNE9GYTJzUm9KSTNsZHJLQWgrRDhXaWlnVXN0TnR3ei81dnFiQUgzcTFlR01vd2NCS0RiDQp3bEg0QlZVRlVMN2lkd3p3RzRFb0ZtSVJFb3dtcFhXejlEd2NjV3FnVGc2KzBLdVNCelc3ZDA3TkxJTEVLR1IzDQpuTVRCMUlaeEFnTUJBQUVDZ2dFQURNM1B1NVBWelhiay83RHoxNXBxdXVybjB4SHZFR29kTnpKOW95UzJGZmp3DQpaMHFBNDVuVVpKMkhIdnJSYW96TTFHZHAxL0liTlRGVDA2T0RSSTR6NDA1VmpVb1N0OG5vTEJUOS9zbnFFRlVuDQp1WmVXY3RyOFBKdjR4Q3F4elFsTVF5L3BMdGc0MUFjemVUakh1MFRSTExVWFkzMTQ4N01pRURVWUJOalNaUUxvDQpMbFd2bHZUYjZQWE9BUkdZU3dWdm11Rkl3MjJJZTVPdEtCYjFmK0ZvbURIQThtOENpczJpcUlYZUF0dDY4VlJCDQppdDVSVCtZQmp2cTRJNTAwcUhjcGdkdGRLajZ2NnBBNWdZY2M0SXZCREx0SVhFeEErY1A5a1J5QWtRMzNBWnhrDQo3THdudXRReWZlK3VYeW9qSyt6YWt1dVpWdjJNc21MVm51Rnc4RkpiSVFLQmdRRDl2b0NmWWk5MG9uaytXMTJzDQp0aXd1SlkxQlRJYmtrbC8vb29STFBMOUN5dXRvZDhvdXIyeDVNVld1NTY4N1JSRFFFdDdrS2hjRksrT2hQOWM1DQpwOGxiLy82a0I1ckFwMFVLZk55SjJMcGpUeW54cDE2WDA3eTc2MGJLMVdOZHptb1l2K0JaMkdRbWZUVGM4WExRDQpJeHJCM3dPOUlNczZYMktiUnZmVmx4Uyt1UUtCZ1FEQVlyUEhLYnJUaUdueVN2T3dBcTZtanQrazcxTnVWY2crDQpkaEhnZXpzTG5HbWZORU9hQkdGWnRhMStNTWNUSCtGM0RVQjNJcnZPK3NPbG9LOXphWHBPTGhOdjhsN0dEMjJWDQozSXlUV1J4OFdBaXBYSFBPUTJEdXhNcWJQbklmWTZQWC9JbWFlb0lRTlQwdjVETXFoTk03MG8wMWpEY3VvREplDQptYnZ6K3ZEcGVRS0JnUURhd0VmOG45WFBsRjQzL3Vaa0JlMVNuemNHcTJYRFdkbCs5ZWxkUDNLWHIzNkE0bnlnDQpBTVhnT1VMbjlYNmc5eXJHWnU1Vy8xNDNMQjRpbm5uNmo0Yk5WSVYvZmJyUkNhTkFwbUl1U0hSdk53a3U5cDVhDQovOFErc1ZlbmQ0MGhpdGoybXp4YjJHeUdyZnhMMmEra2RnOFVRaUhrQTRpUXV6aTBLdHR2L0w1NnFRS0JnQXF0DQpMNWJzN081U1VyYmNpL3VIbXBPcHVDV2FGb0k0Qm4zWTVaTVVvNms0Uy9CRzRUMko0ckVzME8wQTNmdGt1SWwzDQoxYzBHdzI5d0lTMXU1bTI4TzhwYzZqMDdNU0ZDdCswcUtTOEFNZ0dBalRLQTYvaFZhdXExUngwb2NRTG03Ni9MDQoxd01ZcTJFazR6bG1LNlMvYkUyVW1MdVJCWHJ6N3ZlckJuQTZ5K1haQW9HQkFPbldHNWFZZFJxMTlUZEdhWUg1DQpGd3JHTU1kMkcwUTVHd2FpeHBtS3hJZnQyVXJsOURmUVJVdDJWektnbVVKVC96Z0NZTkkzL29ROTJUY2JrbDkxDQpHZ0VOOExISTZRd05CR0lDK0MzS2lvOGdWOFpwdmQyc0FHZjlPTnhRd0gzY1RneXpwb1NaOTZBK2NPcUtLeFl6DQpvTEdEWXBhRDBBL1J0MEZWK0dSWXNmaE4NCi0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0=';

    public $cdn_certificate = "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tDQpNSUlHTHpDQ0JSZWdBd0lCQWdJUkFPWXE4MTlQVkJZMVV4U3J6Skd6Ni80d0RRWUpLb1pJaHZjTkFRRUxCUUF3DQpnWTh4Q3pBSkJnTlZCQVlUQWtkQ01Sc3dHUVlEVlFRSUV4SkhjbVZoZEdWeUlFMWhibU5vWlhOMFpYSXhFREFPDQpCZ05WQkFjVEIxTmhiR1p2Y21ReEdEQVdCZ05WQkFvVEQxTmxZM1JwWjI4Z1RHbHRhWFJsWkRFM01EVUdBMVVFDQpBeE11VTJWamRHbG5ieUJTVTBFZ1JHOXRZV2x1SUZaaGJHbGtZWFJwYjI0Z1UyVmpkWEpsSUZObGNuWmxjaUJEDQpRVEFlRncweU1qQTRNekV3TURBd01EQmFGdzB5TXpBNE16RXlNelU1TlRsYU1CY3hGVEFUQmdOVkJBTU1EQ291DQpkM0JtWTJSdUxtTnZiVENDQVNJd0RRWUpLb1pJaHZjTkFRRUJCUUFEZ2dFUEFEQ0NBUW9DZ2dFQkFMNnd0WlpqDQpDVXZmTjFSaFc2LzNTd2xRNEt2VjQ1S1ZNcWpkbEdtcW5MU2lyZ1B6VkFwSDJKVkY0ZFlySVlCUmFNR2ZDVXpDDQpYMDd5SUZmc0tDVVZ3UldDTjRrUmJJU1BPWjgwdllXbSs3ME5sbGJReXc2b0ErNnRDUEFkcXQrL1luMWdyZnpoDQowUzc2YWsrS1R4QWVDMUVHUW1sbngveS9SQ3dNT3Q2dmVIRXMxU2J0WFQ4dDJEcFljS29FaUthd09aSGtWMldjDQpYSy9MY0FhZUFDTFhHOXI1d3VRTGc0VnJheEdna2plVjJzb0NINFB4YUtLQlN5MDIzRFAvbStwc0FmZXJWNFl5DQpqQndFb052Q1VmZ0ZWUVZRdnVKM0RQQWJnU2dXWWhFU2pDYWxkYlAwUEJ4eGFxQk9EcjdRcTVJSE5idDNUczBzDQpnc1FvWkhlY3hNSFVobkVDQXdFQUFhT0NBdnN3Z2dMM01COEdBMVVkSXdRWU1CYUFGSTJNWHNSVXJZcmhkK21iDQorWnNGNGJnQmpXSGhNQjBHQTFVZERnUVdCQlMrS1dDYzdHSGVoMGJQMkVKYk1vcW5XaXl5ZlRBT0JnTlZIUThCDQpBZjhFQkFNQ0JhQXdEQVlEVlIwVEFRSC9CQUl3QURBZEJnTlZIU1VFRmpBVUJnZ3JCZ0VGQlFjREFRWUlLd1lCDQpCUVVIQXdJd1NRWURWUjBnQkVJd1FEQTBCZ3NyQmdFRUFiSXhBUUlDQnpBbE1DTUdDQ3NHQVFVRkJ3SUJGaGRvDQpkSFJ3Y3pvdkwzTmxZM1JwWjI4dVkyOXRMME5RVXpBSUJnWm5nUXdCQWdFd2dZUUdDQ3NHQVFVRkJ3RUJCSGd3DQpkakJQQmdnckJnRUZCUWN3QW9aRGFIUjBjRG92TDJOeWRDNXpaV04wYVdkdkxtTnZiUzlUWldOMGFXZHZVbE5CDQpSRzl0WVdsdVZtRnNhV1JoZEdsdmJsTmxZM1Z5WlZObGNuWmxja05CTG1OeWREQWpCZ2dyQmdFRkJRY3dBWVlYDQphSFIwY0RvdkwyOWpjM0F1YzJWamRHbG5ieTVqYjIwd0l3WURWUjBSQkJ3d0dvSU1LaTUzY0daalpHNHVZMjl0DQpnZ3AzY0daalpHNHVZMjl0TUlJQmZ3WUtLd1lCQkFIV2VRSUVBZ1NDQVc4RWdnRnJBV2tBZGdDdDk3NzZmUDhRDQp5SXVkUFp3ZVBoaHF0R2NwWGMreERDVEtoWVkwNjl5Q2lnQUFBWUwwcHV2bkFBQUVBd0JITUVVQ0lCa2d3MnV1DQpNWWxWN25DakpoWll3d3ErYVZPZmFRV2JKVytFTjhZTzRJb1hBaUVBdUlkVzlYcEllVXFRNVJ3L3V3VUFiUk5wDQpDMUZobFMxS3dBVDhkNzl6Vm5nQWRnQjZNb3hVMkxjdHRpRHFPT0JTSHVtRUZuQXlFNFZOTzlJcndUcFhvMUxyDQpVZ0FBQVlMMHB1dXdBQUFFQXdCSE1FVUNJUURYSFZxcmhjV0l0bmFRV1lEZW9wL0JwMkxOY2ZYcXF6UlFtWExTDQo3eHdqaHdJZ0s2NEJITXVWeHhEZ2tuV1VpUDJiajQ1NlBhbFlmc05FdTZIWWFYNDFvSmNBZHdEb1B0RGFQdlVHDQpOVExuVnlpOGlXdkpBOVBMMFJGcjdPdHA0WGQ5YlFhOWJnQUFBWUwwcHV1RUFBQUVBd0JJTUVZQ0lRRHo4blpmDQpqQzlqampNYjk2TnJiOW54aHlqV1BhTFloemVYU0E0bTNUTXcrZ0loQUxhNkZOZ1lvbG5laDlmT1d2ZE5iNnVSDQpnVWZpS2xxTjBENFNYTU5LVk4yeE1BMEdDU3FHU0liM0RRRUJDd1VBQTRJQkFRQ284YjhqVjN1VS9HR3NmcDlQDQpVUS9qbXdZZmRialBlQlpRL1pXZUpYREJEb042eURDN3Y1VkpzOTZoWEZ2UzRqQXlzQytyVndJajdpSXc5ZE9GDQpCVS9xeFZRUEc1VWVDZFlBOWpGQmhCUHFtdWJXNVkyQVVBeE9uRkg5bitiSnZPbmE0N0s2dnQwRnh4cHdCR0IyDQpxa3orMnlzMnFSSDdXQjVDL0xoWStaTVp4RENIZ2FPS2JyVDNhY0N2NlE4cmFtL1BFdjFxRnR0TWJFd1VPL0NIDQpHYlNjY2grNHlHVkdNdjNTVVJVUGVLN3VSbklGbkRQZTA1ektTeE1wL21ncnNxSkVyUllENnZlT3FQUUJUU3VvDQp5akI3cGJwZ25oUnZ0eVNDcHpqVnZ3MWpyK3E5dUVwU0JIbW5MUkRwM3IwVEpVSVNuUG9HZTc0YVhDdE01N0V4DQpiR2tZDQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tDQotLS0tLUJFR0lOIENFUlRJRklDQVRFLS0tLS0NCk1JSUdFekNDQS91Z0F3SUJBZ0lRZlZ0UkpyUjJ1aEhiZEJZTHZGTU5wekFOQmdrcWhraUc5dzBCQVF3RkFEQ0INCmlERUxNQWtHQTFVRUJoTUNWVk14RXpBUkJnTlZCQWdUQ2s1bGR5QktaWEp6WlhreEZEQVNCZ05WQkFjVEMwcGwNCmNuTmxlU0JEYVhSNU1SNHdIQVlEVlFRS0V4VlVhR1VnVlZORlVsUlNWVk5VSUU1bGRIZHZjbXN4TGpBc0JnTlYNCkJBTVRKVlZUUlZKVWNuVnpkQ0JTVTBFZ1EyVnlkR2xtYVdOaGRHbHZiaUJCZFhSb2IzSnBkSGt3SGhjTk1UZ3gNCk1UQXlNREF3TURBd1doY05NekF4TWpNeE1qTTFPVFU1V2pDQmp6RUxNQWtHQTFVRUJoTUNSMEl4R3pBWkJnTlYNCkJBZ1RFa2R5WldGMFpYSWdUV0Z1WTJobGMzUmxjakVRTUE0R0ExVUVCeE1IVTJGc1ptOXlaREVZTUJZR0ExVUUNCkNoTVBVMlZqZEdsbmJ5Qk1hVzFwZEdWa01UY3dOUVlEVlFRREV5NVRaV04wYVdkdklGSlRRU0JFYjIxaGFXNGcNClZtRnNhV1JoZEdsdmJpQlRaV04xY21VZ1UyVnlkbVZ5SUVOQk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0MNCkFROEFNSUlCQ2dLQ0FRRUExbk16MXRjOElOQUEwaGRGdU5ZK0I2SS94MEh1TWpESnNHejk5Si9MRXBnUExUK04NClRRRU1nZzhYZjJJdTZiaEllZnNXZzA2dDF6SWxrN2NIdjdsUVA2bE13MEFxNlRuLzJZSEtIeFl5UWRxQUpya2oNCmVvY2dIdVAvSUpvOGxVUnZoM1VHa0VDME1wTVdDUkFJSXo3UzNZY1BiMTFSRkdvS2FjVlBBWEpwejlPVFRHMEUNCm9LTWJnbjZ4bXJudHhaN0ZOM2lmbWdnMCsxWXVXTVFKRGdaa1c3dzMzUEdmS0dpb1ZyQ1NvMXlmdTRpWUNCc2sNCkhhc3doYTZ2c0M2ZWVwM0J3RUljNGdMdzZ1QkswdStRRHJUQlFCYndiNFZDU21UM3BEQ2cvcjh1b3lkYWpvdFkNCnVLM0RHUmVFWSsxdlZ2MkR5MkEweEhTKzVwM2I0ZVRseWd4ZkZRSURBUUFCbzRJQmJqQ0NBV293SHdZRFZSMGoNCkJCZ3dGb0FVVTNtL1dxb3JTczlVZ09IWW04Q2Q4cklEWnNzd0hRWURWUjBPQkJZRUZJMk1Yc1JVcllyaGQrbWINCitac0Y0YmdCaldIaE1BNEdBMVVkRHdFQi93UUVBd0lCaGpBU0JnTlZIUk1CQWY4RUNEQUdBUUgvQWdFQU1CMEcNCkExVWRKUVFXTUJRR0NDc0dBUVVGQndNQkJnZ3JCZ0VGQlFjREFqQWJCZ05WSFNBRUZEQVNNQVlHQkZVZElBQXcNCkNBWUdaNEVNQVFJQk1GQUdBMVVkSHdSSk1FY3dSYUJEb0VHR1AyaDBkSEE2THk5amNtd3VkWE5sY25SeWRYTjANCkxtTnZiUzlWVTBWU1ZISjFjM1JTVTBGRFpYSjBhV1pwWTJGMGFXOXVRWFYwYUc5eWFYUjVMbU55YkRCMkJnZ3INCkJnRUZCUWNCQVFScU1HZ3dQd1lJS3dZQkJRVUhNQUtHTTJoMGRIQTZMeTlqY25RdWRYTmxjblJ5ZFhOMExtTnYNCmJTOVZVMFZTVkhKMWMzUlNVMEZCWkdSVWNuVnpkRU5CTG1OeWREQWxCZ2dyQmdFRkJRY3dBWVlaYUhSMGNEb3YNCkwyOWpjM0F1ZFhObGNuUnlkWE4wTG1OdmJUQU5CZ2txaGtpRzl3MEJBUXdGQUFPQ0FnRUFNcjlodlE1SXcwL0gNCnVrZE4rSng0R1FIY0V4MkFiL3pEY0xSU21qRXptbGRTK3pHZWE2VHZWS3FKalVBWGFQZ1JFSHpTeXJIeFZZYkgNCjdyTTJrWWIyT1ZHL1JyOFBvTHEwOTM1SnhDbzJGNTdrYURsNnI1Uk9WbSt5ZXp1L0NvYTl6Y1YzSEFPNE9MR2kNCkgxOSsyNHJjUmtpMmFBclBzclcwNGpUa1o2azRaZ2xlMHJqOG5TZzZGMEFud25KT0tmMGhQSHpQRS91V0xNVXgNClJQMFQ3ZFdicVdsb2QzenU0ZitrK1RZNENGTTVvb1EwbkJuenZnNnMxU1EzNnlPb2VORFQ1KytTUjJSaU9TTHYNCnh2Y1J2aUtGeG1aRUpDYU9FREtOeUpPdUI1NkRQaS9aK2ZWR2ptTyt3ZWEwM0tiTklhaUdDcFhaTG9VbUd2MzgNCnNiWlhRbTJWMFRQMk9SUUdna0U0OVk5WTNJQmJwTlY5bFhqOXA1di8vY1dvYWFzbTU2ZWtCWWRicWJlNG95QUwNCmw2bEZoZDJ6aStXSk40NHBEZndHRi9ZNFFBNUM1QklHKzN2enhoRm9ZdC9qbVBRVDJCVlBpN0ZwMlJCZ3ZHUXENCjZqRzM1TFdqT2hTYkp1TUxlLzBDanJhWndUaVhXVGIycUhTaWhyWmU2OFprNnMrZ28vbHVucm90RWJhR21BaFkNCkxjbXNKV1R5WG5XME9NR3VmMXBHZytwUnlyYnhtUkUxYTZWcWU4WUFzT2Y0dm1TeXJjakM4YXpqVWVxa2srQjUNCnlPR0JRTWtLVytFU1BNRmdLdU9Yd0lsQ3lwVFBScGdTYWJ1WTBNTFREWEpMUjI3bGs4UXlLR09IUStTd01qNEsNCjAwdS9JNXNVS1VFcm1nUWZreTN4eHpsSVBLMWFFbjg9DQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tDQotLS0tLUJFR0lOIENFUlRJRklDQVRFLS0tLS0NCk1JSUZnVENDQkdtZ0F3SUJBZ0lRT1hKRU92a2l0MUhYMDJ3UTNURTFsVEFOQmdrcWhraUc5dzBCQVF3RkFEQjcNCk1Rc3dDUVlEVlFRR0V3SkhRakViTUJrR0ExVUVDQXdTUjNKbFlYUmxjaUJOWVc1amFHVnpkR1Z5TVJBd0RnWUQNClZRUUhEQWRUWVd4bWIzSmtNUm93R0FZRFZRUUtEQkZEYjIxdlpHOGdRMEVnVEdsdGFYUmxaREVoTUI4R0ExVUUNCkF3d1lRVUZCSUVObGNuUnBabWxqWVhSbElGTmxjblpwWTJWek1CNFhEVEU1TURNeE1qQXdNREF3TUZvWERUSTQNCk1USXpNVEl6TlRrMU9Wb3dnWWd4Q3pBSkJnTlZCQVlUQWxWVE1STXdFUVlEVlFRSUV3cE9aWGNnU21WeWMyVjUNCk1SUXdFZ1lEVlFRSEV3dEtaWEp6WlhrZ1EybDBlVEVlTUJ3R0ExVUVDaE1WVkdobElGVlRSVkpVVWxWVFZDQk8NClpYUjNiM0pyTVM0d0xBWURWUVFERXlWVlUwVlNWSEoxYzNRZ1VsTkJJRU5sY25ScFptbGpZWFJwYjI0Z1FYVjANCmFHOXlhWFI1TUlJQ0lqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FnOEFNSUlDQ2dLQ0FnRUFnQkpsRnpZT3c5c0kNCnM5Q3NWdzEyN2MwbjAweXRVSU5oNHFvZ1RRa3RaQW5jem9tZnpEMnA3UGJQd2R6eDA3SFdlemNvRVN0SDJqbkcNCnZEb1p0RittdlgyZG8yTkN0bmJ5cVRzcmtmamliOURzRmlDUUNUN2k2SFRKR0xTUjFHSmsyMytqQnZHSUdHcVENCklqeTgvaFB3aHhSNzl1UWZqdFRrVWNZUlowWUlVY3VHRkZRL3ZEUCtmbXljL3hhZEdMMVJqaldtcDJiSWNtZmINCklXYXgxSnQ0QThCUU91ak04Tnk4bmt6K3J3V1dOUjlYV3JmL3p2azl0eXkyOWxUZHlPY1NPazJ1VElxM1hKcTANCnR5QTl5bjhpTks1K08yaG1BVVRuQVU1R1U1c3pZUGVVdmxNM2tITkQ4ekxEVSsvYnF2NTBUbW5IYTR4Z2s5N0UNCnh3emY0VEt1ekpNN1VYaVZaNHZ1UFZiK0ROQnBEeHNQOHlVbWF6TnQ5MjVIK25ORDVYNE9wV2F4S1h3eWhHTlYNCmljUU53Wk5VTUJrVHJOTjlONmZyWFRwc05WemJRZGNTMnFsSkM5L1lnSW9KazJLT3RXYlBKWWpOaExpeFA2UTUNCkQ5a0NudXNTVEpWODgyc0ZxVjRXZzh5NForTG9FNTNNVzRMVFRMUHRXLy9lNVhPc0l6c3RBTDgxVlhRSlNkaEoNCldCcC9ramJtVVpJTzh5WjlIRTBYdk1uc1F5YlF2MEZmUUtsRVJQU1o1MWVIbmxBZlYxU29QdjEwWXkreFVHVUoNCjVsaENMa01hVExUd0pVZForZ1FlazlRbVJrcFFnYkxldm5pMy9HY1Y0Y2xYaEI0UFk5YnBZcnJXWDFVdTZsekcNCktBZ0VKVG00RGl1cDhreVhIQWMvRFZMMTdlOHZnZzhDQXdFQUFhT0I4akNCN3pBZkJnTlZIU01FR0RBV2dCU2cNCkVRb2pQcGJ4Qit6aXJ5bnZncVYvMERDa3REQWRCZ05WSFE0RUZnUVVVM20vV3FvclNzOVVnT0hZbThDZDhySUQNClpzc3dEZ1lEVlIwUEFRSC9CQVFEQWdHR01BOEdBMVVkRXdFQi93UUZNQU1CQWY4d0VRWURWUjBnQkFvd0NEQUcNCkJnUlZIU0FBTUVNR0ExVWRId1E4TURvd09LQTJvRFNHTW1oMGRIQTZMeTlqY213dVkyOXRiMlJ2WTJFdVkyOXQNCkwwRkJRVU5sY25ScFptbGpZWFJsVTJWeWRtbGpaWE11WTNKc01EUUdDQ3NHQVFVRkJ3RUJCQ2d3SmpBa0JnZ3INCkJnRUZCUWN3QVlZWWFIUjBjRG92TDI5amMzQXVZMjl0YjJSdlkyRXVZMjl0TUEwR0NTcUdTSWIzRFFFQkRBVUENCkE0SUJBUUFZaDFIY2RDRTluSXJnSjdjejBDN003UERteTE0UjNpSnZtM1dPbm5MKzVOYitxaCtjbGkzdkEwcCsNCnJ2U05iM0k4UXp2QVArdTQzMXlxcWNhdTh2elk3cU43US9hR05ud1U0TTMwOXovKzNyaTBpdkNSbHY3OVEyUisNCi9jelNBYUY5ZmZnWkdjbENLeE8vV0l1NnBLSm1CSGFJa1U0TWlSVE9vazNKTXJPNjZCUWF2SEh4Vy9CQkM1Z0ENCkNpSURFT1VNc2ZuTmtqY1o3VHZ4NURxMitVVVRKbld2dTZydlAzdDNPOUxFQXBFOUdRRFRGMXc1Mno5N0dBMUYNCnpaT0ZsaTlkMzFrV1R6OVJ2ZFZGR0QvdFNvN29CbUYwSXhhMURWQnpKMFJIZnhCZGlTcHJoVEVVeE9pcGFreUENCnZHcDR6N2gvam5aeW1ReWQvdGVSQ0JhaG8xK1YNCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0=";

    /**
     * __construct
     *
     * @return void
     */
    public function __construct()
    {
        $this->apiBunnyCdn = 'https://api.bunny.net/';

        $this->apiDigitalocean = 'https://api.digitalocean.com/';
    }

    /**
     * createZone
     *
     * @param  mixed $formInput
     * @return void
     */
    public function createZone($formInput)
    {
        $zone_prefix = "system-";

        $zone_id = $formInput['user_id'].time();

        $url = $formInput['url'];

        $error_page = \View::make('bunny-cdn.error-page', compact('url'))->render();

        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'AccessKey' => config('services.bunnycdn.apiKey'),
            'Content-Type' => 'application/json',
        ])->post($this->apiBunnyCdn.'pullzone', [
            'Name' => $zone_prefix.$zone_id,
            'OriginUrl' => getDomain($formInput['url']),
            "EnableSafeHop" => true,
            "CacheControlBrowserMaxAgeOverride" => 31919000,
            "EnableQueryStringOrdering" => true,
            "CacheErrorResponses" => true,
            "EnableWebpVary" => true,
            "IgnoreQueryStrings" => false,
            "DisableCookies" => true,
            "FollowRedirects" => false,
            "BlockRootPathAccess" => true,
            "BlockPostRequests" => true,
            "EnableLogging" => true,
            "LoggingIPAnonymizationEnabled" => false,
            "AddCanonicalHeader" => true,
            'ErrorPageEnableCustomCode' => true,
            'EnableAccessControlOriginHeader' => false,
            'ErrorPageWhitelabel' => true,
            'OriginRetries' => 2,
            'OriginRetryDelay' => 10,
            'OriginRetry5XXResponses' => true,
            'EnableSmartCache' => true,
            'CacheControlMaxAgeOverride' => 31919000,
            'CacheControlPublicMaxAgeOverride' => 31919000,
            'Type' => isset($formInput['volume']) ? $formInput['volume'] : 0,
            'ErrorPageCustomCode' => $error_page,
        ]);

        $json = $response->json();

        if (in_array($response->status(), [201, 200])) {
            return [
                "success" => true,
                "response" => $json,
                "zone_id" => $zone_id
            ];
        } else {
            return [
                "success" => false,
                "message" => $json['Message']
            ];
        }
    }

    /**
     * updateZone
     *
     * @param  mixed $formInput
     * @return void
     */
    public function updateZone($formInput)
    {
        $url = $formInput['url'];

        $error_page = \View::make('bunny-cdn.error-page', compact('url'))->render();

        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'AccessKey' => config('services.bunnycdn.apiKey'),
            'Content-Type' => 'application/json',
        ])->post($this->apiBunnyCdn.'pullzone/'.$formInput['zone_id'], [
            "EnableSafeHop" => true,
            "CacheControlMaxAgeOverride" => 31536000,
            "CacheControlBrowserMaxAgeOverride" => 31536000,
            "EnableQueryStringOrdering" => true,
            "CacheErrorResponses" => true,
            "EnableWebpVary" => true,
            "IgnoreQueryStrings" => false,
            "DisableCookies" => true,
            "FollowRedirects" => false,
            "BlockRootPathAccess" => true,
            "BlockPostRequests" => true,
            "EnableLogging" => true,
            "LoggingIPAnonymizationEnabled" => false,
            "AddCanonicalHeader" => true,
            'ErrorPageEnableCustomCode' => true,
            'EnableAccessControlOriginHeader' => false,
            'ErrorPageWhitelabel' => true,
            'Type' => isset($formInput['volume']) ? $formInput['volume'] : 0, //Premium = 0, Volume = 1
            'ErrorPageCustomCode' => $error_page,
        ]);

        $json = $response->json();

        if (in_array($response->status(), [201, 200, 204])) {
            return [
                "success" => true,
                "response" => $json
            ];
        } else {
            return [
                "success" => false,
                "message" => $json['Message']
            ];
        }
    }

    /**
     * purgeZone
     *
     * @param  mixed $formInput
     * @return void
     */
    public function purgeZone($formInput)
    {
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'AccessKey' => config('services.bunnycdn.apiKey'),
            'Content-Type' => 'application/json',
        ])->post($this->apiBunnyCdn.'pullzone/'.$formInput['zone_id'].'/purgeCache');

        $json = $response->json();

        if (in_array($response->status(), [201, 200, 204])) {
            return [
                "success" => true
            ];
        } else {
            return [
                "success" => false,
                "message" => $json['Message']
            ];
        }
    }

    /**
     * updateZoneOrigin
     *
     * @param  mixed $formInput
     * @return void
     */
    public function updateZoneOrigin($formInput)
    {
        $url = $formInput['OriginUrl'];

        $error_page = \View::make('bunny-cdn.error-page', compact('url'))->render();

        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'AccessKey' => config('services.bunnycdn.apiKey'),
            'Content-Type' => 'application/json',
        ])->post($this->apiBunnyCdn.'pullzone/'.$formInput['zone_id'], [
            'OriginUrl' => $formInput['OriginUrl'],
            'ErrorPageCustomCode' => $error_page,
            'Type' => isset($formInput['volume']) ? $formInput['volume'] : 0, //Premium = 0, Volume = 1
        ]);

        $json = $response->json();

        if (in_array($response->status(), [201, 200, 204])) {
            return [
                "success" => true,
                "response" => $json
            ];
        } else {
            return [
                "success" => false
            ];
        }
    }

    /**
     * disableZone
     *
     * @param  mixed $formInput
     * @return void
     */
    public function disableZone($formInput)
    {
        $status = isset($formInput['status']) && $formInput['status'] ? $formInput['status'] : 'active';
        if ($formInput['website']->zone_identifier) {
            $rule = $formInput['website']->getZoneRule($formInput['website']->zone_identifier, 'block-1');
            if ($rule) {
                $client = new \GuzzleHttp\Client();
                $response = $client->request('POST', $this->apiBunnyCdn.'pullzone/'.$formInput['website']->zone_identifier.'/edgerules/'.$rule->guid.'/setEdgeRuleEnabled', [
                    'body' => json_encode([
                        'Id' => $formInput['website']->zone_identifier,
                        'Value' => $formInput['cdn'] ? false : true
                    ]),
                    'headers' => [
                        'Accept' => 'application/json',
                        'AccessKey' => config('services.bunnycdn.apiKey'),
                        'Content-Type' => 'application/json',
                    ],
                ]);
                if (in_array($response->getStatusCode(), [201, 200, 204])) {
                } elseif (in_array($response->getStatusCode(), [404])) {
                    $formInput['website']->step = 0;
                    $formInput['website']->zone_identifier = '';
                    $formInput['website']->cname_identifier = '';
                    $formInput['website']->cdn_domain_id = '';
                    $formInput['website']->cdn_hostname = '';
                }
                $formInput['website']->cdn_status = $status;
                $formInput['website']->save();
            } else {
                //If rule not exist create new rule
                $rule = $this->addOrUpdateEdgeRule(3, $formInput['website'], ['Enabled' => $formInput['cdn'] ? false : true]);
                $formInput['website']->cdn_status = $status;
                $formInput['website']->save();
            }
        } else {
            $formInput['website']->cdn_status = 'active';
            $formInput['website']->save();
        }
    }

    /**
     * createDNS
     *
     * @param  mixed $formInput
     * @return void
     */
    public function createDNS($formInput)
    {
        $cdn_domain = config('services.cdn.domain');

        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Authorization' => 'Bearer '. config('services.digitalocean.apiKey'),
            'Content-Type' => 'application/json',
        ])->post($this->apiDigitalocean.'v2/domains/'.$cdn_domain.'/records', [
            'type' => "CNAME",
            'name' => (string)$formInput['zone_id'],
            'data' => (string)$formInput['hostname'].".",
            'priority' => null,
            'port' => null,
            'weight' => null,
            'flags' => null,
            'tag' => null,
            'ttl' => 43200,
        ]);

        $json = $response->json();

        if ($response->status() == 201) {
            return [
                "success" => true,
                "response" => $json
            ];
        } else {
            return [
                "success" => false,
                "message" => $json['message']
            ];
        }
    }

    /**
     * addHostName
     *
     * @param  mixed $formInput
     * @return void
     */
    public function addHostName($formInput)
    {
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'AccessKey' => config('services.bunnycdn.apiKey'),
            'Content-Type' => 'application/json',
        ])->post($this->apiBunnyCdn.'pullzone/'.$formInput['id'].'/addHostname', [
            'Hostname' => $formInput['hostname'],
        ]);

        $json = $response->json();

        if (in_array($response->status(), [201, 200, 204])) {
            return [
                "success" => true,
            ];
        } else {
            return [
                "success" => false,
                "message" => $json['Message']
            ];
        }
    }

    /**
     * addSSLCertificate
     *
     * @param  mixed $formInput
     * @return void
     */
    public function addSSLCertificate($formInput)
    {
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'AccessKey' => config('services.bunnycdn.apiKey'),
            'Content-Type' => 'application/json',
        ])->post($this->apiBunnyCdn.'pullzone/'.$formInput['zone_id'].'/addCertificate', [
            'hostname' => $formInput['hostname'],
            'CertificateKey' => $this->cdn_key,
            'Certificate' => $this->cdn_certificate,
        ]);

        $json = $response->json();

        if (in_array($response->status(), [201, 200, 204])) {
            return [
                "success" => true,
            ];
        } else {
            return [
                "success" => false,
                "message" => $json['Message']
            ];
        }
    }

    /**
     * addOrUpdateEdgeRule
     *
     * @param  mixed $index
     * @param  mixed $website
     * @param  array $merge
     * @return void
     */
    public function addOrUpdateEdgeRule($index, $website, $merge = array())
    {
        $rules = [
            0 => [
                "ActionType" => 1,
                "ActionParameter1" => "$website->url{{path}}",
                "ActionParameter2" => "",
                "Triggers" => [
                  [
                    "Type" => 8,
                    "PatternMatches" => [
                      "404"
                    ],
                    "PatternMatchingType" => 0,
                    "Parameter1" => ""
                  ],
                  [
                    "Type" => 8,
                    "PatternMatches" => [
                      "429"
                    ],
                    "PatternMatchingType" => 0,
                    "Parameter1" => ""
                  ],
                  [
                    "Type" => 8,
                    "PatternMatches" => [
                      "500"
                    ],
                    "PatternMatchingType" => 0,
                    "Parameter1" => ""
                  ],
                  [
                    "Type" => 8,
                    "PatternMatches" => [
                      "502"
                    ],
                    "PatternMatchingType" => 0,
                    "Parameter1" => ""
                  ]
                ],
                "TriggerMatchingType" => 0,
                "Description" => "redirect-1",
                "Enabled" => true
            ],
            1 => [
                "ActionType" => 1,
                "ActionParameter1" => "$website->url{{path}}",
                "ActionParameter2" => "",
                "Triggers" => [
                  [
                    "Type" => 8,
                    "PatternMatches" => [
                      "401"
                    ],
                    "PatternMatchingType" => 0,
                    "Parameter1" => ""
                  ],
                  [
                    "Type" => 8,
                    "PatternMatches" => [
                      "403"
                    ],
                    "PatternMatchingType" => 0,
                    "Parameter1" => ""
                  ]
                ],
                "TriggerMatchingType" => 0,
                "Description" => "redirect-2",
                "Enabled" => true
            ],
            2 => [
                "ActionType" => 5,
                "ActionParameter1" => "link",
                "ActionParameter2" => "$website->url{{path}}; rel=\"canonical\"",
                "Triggers" => [
                  [
                    "Type" => 8,
                    "PatternMatches" => [
                      "304"
                    ],
                    "PatternMatchingType" => 0,
                    "Parameter1" => ""
                  ],
                  [
                    "Type" => 8,
                    "PatternMatches" => [
                      "200"
                    ],
                    "PatternMatchingType" => 0,
                    "Parameter1" => ""
                  ]
                ],
                "TriggerMatchingType" => 0,
                "Description" => "headers-1",
                "Enabled" => true
            ],
            3 => [
                "ActionType" => 4,
                "ActionParameter1" => "",
                "ActionParameter2" => "",
                "Triggers" => [
                  [
                    "Type" => 0,
                    "PatternMatches" => [
                      "*"
                    ],
                    "PatternMatchingType" => 0,
                    "Parameter1" => ""
                  ]
                ],
                "TriggerMatchingType" => 0,
                "Description" => "block-1",
                "Enabled" => false
            ],
            4 => [
                "ActionType" => 2,
                "ActionParameter1" => config('app.optimize_server_url')."/on-the-fly{{path}}&zone_id=".$website->zone_identifier,
                "ActionParameter2" => "",
                "Triggers" => [
                  [
                    "Type" => 6,
                    "PatternMatches" => [
                      "*optimize=1"
                    ],
                    "PatternMatchingType" => 0,
                    "Parameter1" => ""
                  ],
                  [
                    "Type" => 6,
                    "PatternMatches" => [
                      "*optimize=1*"
                    ],
                    "PatternMatchingType" => 0,
                    "Parameter1" => ""
                  ]
                ],
                "TriggerMatchingType" => 0,
                "Description" => "origin-1",
                "Enabled" => true
            ]
        ];

        if (!empty($merge)) {
            $rule = array_replace($rules[$index], $merge);
        } else {
            $rule = $rules[$index];
        }

        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'AccessKey' => config('services.bunnycdn.apiKey'),
            'Content-Type' => 'application/json',
        ])->post($this->apiBunnyCdn.'pullzone/'.$website->zone_identifier.'/edgerules/addOrUpdate', $rule);

        $json = $response->json();

        if (in_array($response->status(), [201, 200, 204])) {
            //Save zone rule
            $rule = \App\Models\ZoneRule::where('zone_id', $website->zone_identifier)->where('guid', $json['Guid'])->first();
            if (!$rule) {
                \App\Models\ZoneRule::create([
                    'guid' => $json['Guid'],
                    'zone_id' => $website->zone_identifier,
                    'action_type' => $json['ActionType'],
                    'parameter_1' => $json['ActionParameter1'],
                    'parameter_2' => $json['ActionParameter2'],
                    'trigger_matching_type' => $json['TriggerMatchingType'],
                    'description' => $json['Description'],
                    'enabled' => $json['Enabled']
                ]);
            } else {
                $rule->action_type = $json['ActionType'];
                $rule->parameter_1 = $json['ActionParameter1'];
                $rule->parameter_2 = $json['ActionParameter2'];
                $rule->trigger_matching_type = $json['TriggerMatchingType'];
                $rule->description = $json['Description'];
                $rule->enabled = $json['Enabled'];
                $rule->save();
            }
            return [
                "success" => true,
            ];
        } elseif (in_array($response->status(), [404])) {
            $website->step = 0;
            $website->zone_identifier = '';
            $website->cname_identifier = '';
            $website->cdn_domain_id = '';
            $website->cdn_hostname = '';
            $website->cdn = 0;
            $website->cdn_status = 'active';
            $website->save();
            return [
                "success" => false
            ];
        } else {
            return [
                "success" => false
            ];
        }
    }

    /**
     * forceSSl
     *
     * @param  mixed $formInput
     * @return void
     */
    public function forceSSl($formInput)
    {
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'AccessKey' => config('services.bunnycdn.apiKey'),
            'Content-Type' => 'application/json',
        ])->post($this->apiBunnyCdn.'pullzone/'.$formInput['zone_id'].'/setForceSSL', [
            'Hostname' => $formInput['hostname'],
            'ForceSSL' => true,
        ]);

        $json = $response->json();

        if (in_array($response->status(), [201, 200, 204])) {
            return [
                "success" => true,
            ];
        } else {
            return [
                "success" => false,
                "message" => $json['Message']
            ];
        }
    }

    /**
     * fetchOriginList
     *
     * @return void
     */
    public function fetchOriginList()
    {
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'AccessKey' => config('services.bunnycdn.apiKey'),
            'Content-Type' => 'application/json',
        ])->get($this->apiBunnyCdn.'region');

        $json = $response->json();

        if (in_array($response->status(), [201, 200, 204])) {
            return [
                "success" => true,
                "response" => $json
            ];
        } else {
            return [
                "success" => false,
                "message" => $json['Message']
            ];
        }
    }

    /**
     * getZoneStats
     *
     * @param  mixed $formInput
     * @return void
     */
    public function getZoneStats($formInput)
    {
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'AccessKey' => $formInput['api_key'],
            'Content-Type' => 'application/json',
        ])->get($this->apiBunnyCdn.'statistics', [
            'hourly' => false,
            'loadErrors' => false,
            'pullZone' => $formInput['zone_id'],
            'dateFrom' => $formInput['dateFrom'],
            'dateTo' => $formInput['dateTo'],
        ]);

        $json = $response->json();

        if (in_array($response->status(), [201, 200, 204])) {
            return [
                "success" => true,
                "response" => $json
            ];
        } else {
            return [
                "success" => false
            ];
        }
    }

    /**
     * updateUserWebsitesZones
     *
     * @param  mixed $user
     * @param  mixed $active
     * @return void
     */
    public function updateUserWebsitesZones($user, $active, $notification = false)
    {
        if($active) {
            $websites = $user->websites()->where('type', 'pro')->whereIn('cdn_status', ['suspended'])->whereNotNull('zone_identifier')->get();
        } else {
            $websites = $user->websites()->where('type', 'pro')->whereIn('cdn_status', ['active'])->whereNotNull('zone_identifier')->get();
        }

        if (count($websites) > 0) {
            UpdateZoneRule::dispatch(['user' => $user, 'user_id' => $user->id, 'websites' => $websites, 'status' => $active ? 'active' : 'suspended', 'notification' => $notification])->delay(now()->addSeconds(5))->onQueue('update_zone_rules');
        }
    }

    /**
     * Convert all websites to free
     * @param  mixed $user
     * @return void
     */
    public function convertAllWebsiteToFree($user)
    {
        $websites = $user->websites()->where('type', 'pro')->get();

        if (count($websites) > 0) {

            foreach ($websites as $website) {

                if ($website->zone_identifier) {
                    $this->deleteZone($website->zone_identifier);
                }

                if ($website->cname_identifier) {
                    $this->deleteCName($website->cname_identifier);
                }

                $website->type = 'free';
                $website->was_pro = 1;
                $website->cdn = 0;
                $website->step = 0;
                $website->cdn_status = 'active';
                $website->cdn_domain_id = '';
                $website->cdn_hostname = '';
                $website->cname_identifier = '';
                $website->zone_identifier = '';
                $website->cdn_hostname = '';

                $website->save();

            }

        }

    }

    /**
     * deleteZone
     *
     * @param  mixed $formInput
     * @return void
     */
    public function deleteZone($zone_id)
    {
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'AccessKey' => config('services.bunnycdn.apiKey'),
            'Content-Type' => 'application/json',
        ])->delete($this->apiBunnyCdn.'pullzone/'.$zone_id);

        if (in_array($response->status(), [201, 200])) {
            return [
                "success" => true
            ];
        } else {
            return [
                "success" => false
            ];
        }
    }

    /**
     * getZone
     *
     * @param  mixed $formInput
     * @return void
     */
    public function getZone($zone_id)
    {
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'AccessKey' => config('services.bunnycdn.apiKey'),
            'Content-Type' => 'application/json',
        ])->get($this->apiBunnyCdn.'pullzone/'.$zone_id);

        $json = $response->json();

        if (in_array($response->status(), [201, 200])) {
            return $json;
        } else {
            return null;
        }
    }

    /**
     * cname_id
     *
     * @param  mixed $formInput
     * @return void
     */
    public function deleteCName($cname_id)
    {
        $cdn_domain = config('services.cdn.domain');

        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Authorization' => 'Bearer '. config('services.digitalocean.apiKey'),
            'Content-Type' => 'application/json',
        ])->delete($this->apiDigitalocean.'v2/domains/'.$cdn_domain.'/records/'.$cname_id);

        $json = $response->json();

        if ($response->status() == 204) {
            return [
                "success" => true,
                "response" => $json
            ];
        } else {
            return [
                "success" => false
            ];
        }
    }

    /**
     * getStats
     *
     * @param  mixed $formInput
     * @return void
     */
    public function getStats($formInput)
    {
        $cdn_user_stats = \App\Models\CdnUserStat::where('user_id', $formInput['user_id'])->select(\DB::raw('SUM(chargeable_volume_amount) as chargeable_volume_amount'), \DB::raw('SUM(chargeable_premium_amount) as chargeable_premium_amount'), \DB::raw('SUM(overusage_premium_bandwidth) as overusage_premium_bandwidth'), \DB::raw('SUM(overusage_volume_bandwidth) as overusage_volume_bandwidth'))->first();

        $paid_amount = (float)\App\Models\BillingHistory::where('user_id', $formInput['user_id'])
            ->where('type', 'cdn')
            ->where(function ($query) {
                $query->where('status', 'succeeded');
            })
            ->sum('amount_paid');

        $usage_amount = $cdn_user_stats ? ($cdn_user_stats->chargeable_volume_amount + $cdn_user_stats->chargeable_premium_amount) : 0;

        $usage_bandwidth = $cdn_user_stats ? ($cdn_user_stats->overusage_premium_bandwidth + $cdn_user_stats->overusage_volume_bandwidth) : 0;

        $balance = round($paid_amount - $usage_amount, 2);

        $cost = ($usage_amount && $usage_bandwidth ? round((((($usage_amount / $usage_bandwidth) * 1000) * 1000) * 1000), 2) : '');

        $cdn_stat_query = \App\Models\CdnStat::where('user_id', $formInput['user_id']);

        if (isset($formInput['website_id']) && $formInput['website_id']) {
            $cdn_stat_query->where('website_id', $formInput['website_id']);
        }

        if (isset($formInput['date']) && $formInput['date']) {
            list($date, $type) = explode('|', $formInput['date']);

            if ($type == 'exact') {
                $cdn_stat_query->whereYear('date', \Carbon\Carbon::parse($date)->format('Y'));
                $cdn_stat_query->whereMonth('date', \Carbon\Carbon::parse($date)->format('m'));
            } elseif ($type == "match") {
                $cdn_stat_query->whereBetween('date', [
                    \Carbon\Carbon::parse($date)->format('Y-m-d'),
                    \Carbon\Carbon::now()->format('Y-m-d')
                ]);
            }
        }

        $stats_query = clone $cdn_stat_query;

        $cdn = $cdn_stat_query->select(\DB::raw('(SUM(requests_served_chart * cache_hit_rate_chart) / SUM(requests_served_chart)) as cache_hit_rate_chart'), \DB::raw('SUM(bandwidth) as bandwidth'), \DB::raw('SUM(requests_served_chart) as requests_served_chart'))->first();

        if ($cdn) {
            $cdn->cache_hit_rate_chart = round($cdn->cache_hit_rate_chart);
            $cdn->requests_served_chart = number_format($cdn->requests_served_chart);
            $cdn->bandwidth = readableBytes($cdn->bandwidth);
        }

        //Charts
        $stats = $stats_query->select('date', \DB::raw('(SUM(requests_served_chart * cache_hit_rate_chart) / SUM(requests_served_chart)) as cache_hit_rate_chart'), \DB::raw('SUM(bandwidth) as total_bandwidth'), \DB::raw('SUM(bandwidth) - SUM(bandwidth_cached_chart) as uncached_bandwidth'), \DB::raw('SUM(bandwidth_cached_chart) as cached_bandwidth'), \DB::raw('SUM(requests_served_chart) as requests_served_chart'))->groupBy('date')->orderBy('date', 'ASC')->get();

        $dates = [];
        $total_bandwidth = [];
        $uncached_bandwidth = [];
        $cached_bandwidth = [];

        if (count($stats) > 0) {
            foreach ($stats as $stat) {
                $dates[] = \Carbon\Carbon::parse($stat->date)->toDateString();

                $total_bandwidth[] = [
                    'date' => \Carbon\Carbon::parse($stat->date)->toDateString(),
                    'value' => $stat->total_bandwidth,
                ];

                $uncached_bandwidth[] = [
                    'date' => \Carbon\Carbon::parse($stat->date)->toDateString(),
                    'value' => $stat->uncached_bandwidth,
                ];

                $cached_bandwidth[] = [
                    'date' => \Carbon\Carbon::parse($stat->date)->toDateString(),
                    'value' => $stat->cached_bandwidth,
                ];
            }
        }

        list($date, $type) = explode('|', $formInput['date']);

        if ($type == "exact") {
            $interval = \Carbon\Carbon::createFromDate($date)->daysInMonth;
        } else {
            $to = \Carbon\Carbon::createFromFormat('Y-m-d', $date);
            $from = \Carbon\Carbon::now();
            $interval = abs($to->diffInDays($from));
        }

        if (count($total_bandwidth) > 0) {
            $total_bandwidth = $this->arrayMinimumValues($total_bandwidth, $interval, $formInput, $dates);
        }

        if (count($uncached_bandwidth) > 0) {
            $uncached_bandwidth = $this->arrayMinimumValues($uncached_bandwidth, $interval, $formInput, $dates);
        }

        if (count($cached_bandwidth) > 0) {
            $cached_bandwidth = $this->arrayMinimumValues($cached_bandwidth, $interval, $formInput, $dates);
        }

        return [
            'usage_amount' => round($usage_amount, 2),
            'usage_amount_display' => number_format($usage_amount, 2),
            'usage_bandwidth' => $usage_bandwidth,
            'paid_amount' => number_format($paid_amount, 2),
            'paid_amount_display' => $paid_amount,
            'balance' => $balance,
            'balance_display' => number_format($balance, 2),
            'cost' => $cost,
            'cdn' => $cdn,
            'stats' => [
                'dates' => $dates,
                'total_bandwidth' => $total_bandwidth,
                'uncached_bandwidth' => $uncached_bandwidth,
                'cached_bandwidth' => $cached_bandwidth,
            ],
        ];
    }

    /**
     * getStatsDatesForFilter
     *
     * @param  mixed $formInput
     * @return void
     */
    public function getStatsDatesForFilter($formInput)
    {
        $records = \App\Models\CdnStat::where('user_id', $formInput['user_id'])->selectRaw('DATE_FORMAT(date, "%Y-%m") as dt')->groupBy('dt')->limit(12)->get();

        $dates = [];

        foreach ($records as $key => $row) {
            $date = \Carbon\Carbon::createFromDate($row->dt);

            $dates[] = array(
                'value' => \Carbon\Carbon::parse($date)->toDateString().'|exact',
                'label' => $date->shortMonthName.' '.$date->year,
            );
        }

        $pre_dates[] = array(
            'value' => \Carbon\Carbon::now()->subDays(30)->toDateString().'|match',
            'label' => 'Last 30 Days',
        );

        $pre_dates[] = array(
            'value' => \Carbon\Carbon::now()->subDays(15)->toDateString().'|match',
            'label' => 'Last 15 Days',
        );

        $dates = array_reverse($dates);

        $dates = array_merge($pre_dates, $dates);

        return $dates;
    }

    /**
     * arrayMinimumValues
     *
     * @param  mixed $array
     * @param  mixed $size
     * @return void
     */
    public function arrayMinimumValues($array, $size, $formInput, $exclusive = array())
    {
        list($date, $type) = explode('|', $formInput['date']);

        $new_array = $array;

        for ($i = 1; $i <= $size; $i++) {
            $date = \Carbon\Carbon::createFromDate($date)->toDateString();
            if (!in_array($date, $exclusive) && count($new_array) < $size) {
                array_unshift($new_array, [
                    'value' => 0,
                    'date' => $date
                ]);
            }
            $date = \Carbon\Carbon::createFromDate($date)->addDay()->toDateString();
        }

        return array_values(collect($new_array)->sortBy('date')->toArray());
    }

    /**
     * authenticate_cdn_url
     *
     * @param  mixed $path
     * @return string
     */
    public function authenticate_cdn_url(string $path): string
    {
        $expires_seconds = 3600;
        $zone_url = config('services.bunnycdn.plugin_download_endpoint_url');
        $security_key = config('services.bunnycdn.plugin_download_token');
        $expires = (time() + $expires_seconds);
        $hash_base = $security_key . $path . $expires;
        $token = md5($hash_base, true);
        $token = base64_encode($token);
        $token = strtr($token, '+/', '-_');
        $token = str_replace('=', '', $token);
        return "{$zone_url}{$path}?token={$token}&expires={$expires}";
    }
}
