import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { API_SET_COOKIE } from '../../../awsconfig.js'
import { XtermService } from 'src/app/services/xterm.service'
import { SocketService } from 'src/app/services/socket.service'
import { ErrorService } from 'src/app/services/error.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('term', { static: true }) term: ElementRef

  form: FormGroup
  werror: Subscription
  public error = ''
  public awsregion = null
  private wsprotocol = `aws.iot.securedtunneling-1.0`
  private protopath = '../../../assets/protobuf/format.proto'
  hideRequiredControl = new FormControl(false)
  floatLabelControl = new FormControl('auto')

  aws_regions: any = [
    {
      name: 'China (Beijing) cn-north-1',
      region: 'cn-north-1',

    },
    {
      name: 'China (Ningxia) cn-northwest-1',
      region: 'cn-northwest-1',

    },
  ]

  constructor(private fb: FormBuilder, private http: HttpClient, private xtermService: XtermService, private socketService: SocketService, private errorService: ErrorService) {
    this.form = this.fb.group({
      hideRequired: this.hideRequiredControl,
      region: [null, Validators.required],
      token: [null, Validators.required]
    });
  }


  async ngOnInit() {

    this.werror = this.errorService.werror.subscribe((d: string) => this.error = d)

  }

  async ngAfterViewInit() {
    this.xtermService.termInit(this.term.nativeElement)

  }

  async onSubmit(form: FormGroup) {
    this.errorService.werror.next('')
    let access_token:string = form.value.token
    let urlencoded_token = encodeURI(access_token)
    const url = `wss://data.tunneling.iot.${form.value.region.region}.amazonaws.com.cn:433/tunnel?local-proxy-mode=source&access-token=${urlencoded_token}`

    // const cookie = await this.http.post(`${API_SET_COOKIE}`, {token: form.value.token, region: form.value.region.region}, {withCredentials: true, }).toPromise()
    // console.log('cookie:',cookie)
    this.startSSH(url)
  }

  startSSH(url) {
    this.socketService.openWebSocket(url, this.wsprotocol)
  }

  ngOnDestroy() {
    this.werror.unsubscribe()
  }

}
